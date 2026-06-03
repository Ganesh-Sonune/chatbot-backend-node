import { Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { ChatRequestModel } from '../../model/chat-request.model';
import { ChatResponseModel } from '../../model/chat-response.model';
import { IntentDetectorService } from '../intent-detector.service';
import { FaqRepository } from '../../repository/faq.repository';
import { CourseRepository } from '../../repository/course.repository';
import { TrainerRepository } from '../../repository/trainer.repository';
import { BotConfigRepository } from '../../repository/bot-config.repository';
import { LeadRepository } from '../../repository/lead.repository';
import { ReferralRepository } from '../../repository/referral.repository';     // Feature 2
import { DurationParserService } from '../duration-parser.service';
import { WhatsAppService } from '../whatsapp.service';                          // Feature 3
import { TextUtil } from '../../util/text-util.util';
import { Lead } from '../../entity/lead.entity';
import { Referral } from '../../entity/referral.entity';                          // Feature 2

@Injectable()
export class ChatServiceImpl implements ChatService {
  private sessionState = new Map<string, Map<string, string>>();

  constructor(
    private readonly intentDetector: IntentDetectorService,
    private readonly faqRepo: FaqRepository,
    private readonly courseRepo: CourseRepository,
    private readonly trainerRepo: TrainerRepository,
    private readonly configRepo: BotConfigRepository,
    private readonly leadRepo: LeadRepository,
    private readonly referralRepo: ReferralRepository,    // Feature 2
    private readonly durationParser: DurationParserService,
    private readonly whatsApp: WhatsAppService,           // Feature 3
  ) {}

  async process(request: ChatRequestModel): Promise<ChatResponseModel> {
    const message = request.message;
    const sessionId = request.sessionId ?? 'default-session';
    console.log('DEBUG incoming message:', message);
    console.log('DEBUG sessionId:', sessionId);

    if (!message || message.trim() === '') return ChatResponseModel.simple(await this.defaultReply());

    if (TextUtil.isInappropriate(message)) {
      console.log('DEBUG message is inappropriate: ' + message);
      return ChatResponseModel.simple('I can only help you with CodeDisha courses and training. How can I assist you?');
    }

    if (sessionId && this.sessionState.has(sessionId)) return this.handleConversationState(message, sessionId);

    const intent = await this.intentDetector.detect(message);
    console.log('DEBUG intent result:', intent);

    if (!intent) {
      console.log('DEBUG intent is NULL — falling to defaultReply');
      return ChatResponseModel.simple(await this.defaultReply());
    }

    const response = await this.resolveResponse(intent, message, sessionId);
    return ChatResponseModel.simple(response);
  }

  private async resolveResponse(intent: any, message: string, sessionId: string): Promise<string> {
    const actionType = intent.actionType?.toUpperCase();
    console.log('DEBUG actionType:', actionType);

    switch (actionType) {
      case 'STATIC':
        return intent.responseTemplate;

      case 'CALLBACK_REQUEST': {
        const state = new Map<string, string>();
        state.set('step', 'AWAITING_NAME');
        state.set('requestType', 'CALLBACK');
        this.sessionState.set(sessionId, state);
        return 'Sure! May I know your name?';
      }

      //  Feature 1 — Course Fit Quiz
      case 'COURSE_QUIZ': {
        const state = new Map<string, string>();
        state.set('step', 'QUIZ_LEVEL');
        state.set('requestType', 'QUIZ');
        this.sessionState.set(sessionId, state);
        return (
          `Great! Let me help you find the perfect course. 🎯\n\n` +
          `First — what's your coding background?\n\n` +
          `1. Complete beginner (never coded)\n` +
          `2. Some basics (HTML/CSS, a little Python etc.)\n` +
          `3. Working professional (want to upskill)`
        );
      }

      case 'FAQ_LOOKUP': {
        const cleaned = TextUtil.clean(message);
        console.log('DEBUG cleaned:', cleaned);
        const byQuestion = await this.faqRepo.searchByQuestion(cleaned);
        console.log('DEBUG byQuestion size:', byQuestion.length);
        if (byQuestion.length > 0) return byQuestion[0].answer;
        const keywords = TextUtil.extract(message);
        for (const kw of keywords) {
          const results = await this.faqRepo.searchByKeyword(kw);
          if (results.length > 0) return results[0].answer;
        }
        return this.fallback(intent);
      }

      case 'COURSE_LOOKUP': {
        const cleaned = TextUtil.clean(message);
        const keywords = TextUtil.extract(message);
        const modes = ['offline', 'online', 'hybrid'];
        for (const mode of modes) {
          if (message.toLowerCase().includes(mode)) {
            const byMode = await this.courseRepo.findByModeContainingIgnoreCaseAndStatusTrue(mode);
            if (byMode.length > 0) return this.formatCourseList(byMode, null);
            return `Sorry, no active courses available in ${mode} mode right now.`;
          }
        }
        const durationFilter = await this.durationParser.parse(message);
        console.log('DEBUG durationFilter:', durationFilter);
        if (durationFilter) {
          const allCourses = await this.courseRepo.findByStatusTrue();
          const filtered = allCourses.filter(c => {
            if (!c.duration) return false;
            const match = c.duration.match(/(\d+)/);
            if (!match) return false;
            const weeks = parseInt(match[1]);
            if (durationFilter.operator === 'LESS_THAN') return weeks < durationFilter.weeks;
            if (durationFilter.operator === 'GREATER_THAN') return weeks > durationFilter.weeks;
            if (durationFilter.operator === 'EQUALS') return weeks === durationFilter.weeks;
            return false;
          });
          if (filtered.length > 0) return this.formatCourseList(filtered, null);
          return 'No courses found matching that duration.';
        }
        const phraseMatch = await this.courseRepo.searchByKeyword(cleaned);
        if (phraseMatch.length === 1) return this.fillCourse(intent.responseTemplate, phraseMatch[0]);
        for (const kw of keywords) {
          if (kw.length < 3) continue;
          const results = await this.courseRepo.searchByKeyword(kw);
          if (results.length === 1) return this.fillCourse(intent.responseTemplate, results[0]);
        }
        const allCourses = await this.courseRepo.findByStatusTrue();
        if (allCourses.length > 0) return this.formatCourseList(allCourses, null);
        return this.fallback(intent);
      }

      case 'TRAINER_LOOKUP': {
        const keywords = TextUtil.extract(message);
        const roleWords = ['trainer', 'trainers', 'faculty', 'mentor', 'lecturer', 'instructor', 'teacher', 'coach', 'expert'];
        const specKeywords = keywords.filter(kw => !roleWords.includes(kw));
        for (const kw of keywords) {
          const byName = await this.trainerRepo.findByNameContainingIgnoreCaseAndStatusTrue(kw);
          if (byName.length > 0) return this.formatTrainerList(byName, intent.responseTemplate);
        }
        for (const kw of specKeywords) {
          if (kw.length < 3) continue;
          const bySpec = await this.trainerRepo.searchBySpecialization(kw);
          if (bySpec.length > 0) return this.formatTrainerList(bySpec, intent.responseTemplate);
        }
        const allTrainers = await this.trainerRepo.findByStatusTrue();
        if (allTrainers.length > 0) return this.formatTrainerList(allTrainers, null);
        return this.fallback(intent);
      }

      default:
        return this.defaultReply();
    }
  }

  // ─── Conversation state handler ─────────────────────────────────────────────

  private async handleConversationState(message: string, sessionId: string): Promise<ChatResponseModel> {
    const state = this.sessionState.get(sessionId);
    const step = state?.get('step');

    switch (step) {

      // ── Callback / Enrollment flow ─────────────────────────────────────────

      case 'AWAITING_NAME': {
        const name = message.trim();
        if (name.length < 2) return ChatResponseModel.simple('Please enter a valid name.');
        state?.set('name', name);
        state?.set('step', 'AWAITING_EMAIL');
        return ChatResponseModel.simple(`Nice to meet you, ${name}! Please share your email address.`);
      }

      case 'AWAITING_EMAIL': {
        const email = message.trim();
        if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email))
          return ChatResponseModel.simple('That doesn\'t look like a valid email. Please enter a valid email address (e.g. rahul@gmail.com).');
        state?.set('email', email);
        state?.set('step', 'AWAITING_COURSE');
        const courses = await this.courseRepo.findByStatusTrue();
        const response = 'Thanks! Which course are you interested in?\n\n' + courses.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
        return ChatResponseModel.simple(response);
      }

      case 'AWAITING_COURSE': {
        const courses = await this.courseRepo.findByStatusTrue();
        const selected = message.trim();
        const index = Number(selected) - 1;
        let courseName: string | null = null;
        if (!isNaN(index) && index >= 0 && index < courses.length) {
          courseName = courses[index].name;
        } else {
          courseName = courses.find(c => c.name.toLowerCase().includes(selected.toLowerCase()))?.name ?? null;
        }
        if (!courseName) {
          const response = 'Please select a valid option:\n\n' + courses.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
          return ChatResponseModel.simple(response);
        }
        state?.set('interestedIn', courseName);
        state?.set('step', 'AWAITING_PHONE');
        return ChatResponseModel.simple('Great choice! Please share your phone number.');
      }

      case 'AWAITING_PHONE': {
        const phone = message.trim().replace(/\s+/g, '');
        if (!/^\d{10,15}$/.test(phone))
          return ChatResponseModel.simple('Please enter a valid 10-digit phone number.');

        const lead = new Lead();
        lead.name         = state?.get('name') ?? '';
        lead.email        = state?.get('email') ?? '';
        lead.phone        = phone;
        lead.interestedIn = state?.get('interestedIn') ?? '';
        lead.requestType  = state?.get('requestType') ?? 'CALLBACK';
        lead.status       = 'PENDING';
        await this.leadRepo.save(lead);

        //  Feature 3 — WhatsApp notifications (fire-and-forget)
        this.whatsApp.sendToStudent(lead.phone, lead.name, lead.interestedIn).catch(() => {});
        this.whatsApp.notifySalesTeam(lead.phone, lead.name, lead.email, lead.interestedIn, lead.requestType).catch(() => {});

        //  Feature 2 — Move to referral step instead of ending session
        state?.set('phone', phone);
        state?.set('step', 'AWAITING_REFERRAL');

        return ChatResponseModel.simple(
          `Thank you, ${lead.name}! 🎉 We've received your request and will call you at ${lead.phone} shortly!\n\n` +
          `💰 *Refer a friend & save!*\n` +
          `Do you know someone who'd also benefit from ${lead.interestedIn}?\n` +
          `Share their details and you *both* get ₹500 off the course fee!\n\n` +
          `Please share your friend's name (or type *skip* to continue).`
        );
      }

      // ── Feature 2 — Referral Capture ──────────────────────────────────────

      case 'AWAITING_REFERRAL': {
        const input = message.trim().toLowerCase();
        if (input === 'skip' || input === 'no' || input === 'nope' || input === 'n') {
          this.sessionState.delete(sessionId);
          return ChatResponseModel.simple(`No worries! Our team will reach you soon. Have a great day! 😊`);
        }
        const name = message.trim();
        if (name.length < 2)
          return ChatResponseModel.simple(`Please enter a valid name, or type *skip* to continue.`);

        state?.set('referredName', name);
        state?.set('step', 'AWAITING_REFERRAL_PHONE');
        return ChatResponseModel.simple(`Great! Now share ${name}'s phone number so we can reach them.`);
      }

      case 'AWAITING_REFERRAL_PHONE': {
        const phone = message.trim().replace(/\s+/g, '');
        if (!/^\d{10,15}$/.test(phone))
          return ChatResponseModel.simple('Please enter a valid 10-digit phone number for your friend.');

        const referral = new Referral();
        referral.referrerName  = state?.get('name') ?? '';
        referral.referrerPhone = state?.get('phone') ?? '';
        referral.referredName  = state?.get('referredName') ?? '';
        referral.referredPhone = phone;
        referral.interestedIn  = state?.get('interestedIn') ?? '';
        referral.status        = 'PENDING';
        await this.referralRepo.save(referral);

        //  Feature 3 — Notify sales team about referral
        this.whatsApp.notifyReferral(
          referral.referrerName,
          referral.referredName,
          referral.referredPhone,
          referral.interestedIn,
        ).catch(() => {});

        this.sessionState.delete(sessionId);
        return ChatResponseModel.simple(
          `🎉 Awesome! We've noted the referral.\n` +
          `Both you and ${referral.referredName} will receive ₹500 off when ${referral.referredName} enrolls.\n` +
          `Our team will reach out to both of you shortly! 😊`
        );
      }

      // ── Feature 1 — Course Fit Quiz ────────────────────────────────────────

      case 'QUIZ_LEVEL': {
        const lower = message.trim().toLowerCase();
        let level = '';
        if (message.trim() === '1' || lower.includes('beginner') || lower.includes('never'))
          level = 'BEGINNER';
        else if (message.trim() === '2' || lower.includes('basic') || lower.includes('some'))
          level = 'INTERMEDIATE';
        else if (message.trim() === '3' || lower.includes('professional') || lower.includes('working'))
          level = 'PROFESSIONAL';
        else
          return ChatResponseModel.simple(
            'Please choose one of the options:\n\n1. Complete beginner\n2. Some basics\n3. Working professional'
          );

        state?.set('quizLevel', level);
        state?.set('step', 'QUIZ_GOAL');
        return ChatResponseModel.simple(
          `Got it! Now, what's your main goal?\n\n` +
          `1. Get a job (fresher / career switch)\n` +
          `2. Upskill for a promotion or raise\n` +
          `3. Build my own project / startup`
        );
      }

case 'QUIZ_GOAL': {
  const lower = message.trim().toLowerCase();
  let goal = '';
  if (message.trim() === '1' || lower.includes('job') || lower.includes('career') || lower.includes('fresher'))
    goal = 'JOB';
  else if (message.trim() === '2' || lower.includes('upskill') || lower.includes('promot') || lower.includes('raise'))
    goal = 'UPSKILL';
  else if (message.trim() === '3' || lower.includes('project') || lower.includes('startup') || lower.includes('build'))
    goal = 'PROJECT';
  else
    return ChatResponseModel.simple(
      'Please choose one of the options:\n\n1. Get a job\n2. Upskill / promotion\n3. Build a project'
    );

  state?.set('quizGoal', goal);
  state?.set('step', 'QUIZ_MODE');          // ← changed from QUIZ_TIME
  return ChatResponseModel.simple(
    `Got it! What learning mode do you prefer?\n\n` +
    `1. Online (learn from anywhere)\n` +
    `2. Offline (attend in-person classes)\n` +
    `3. Hybrid (mix of both)`
  );
}

case 'QUIZ_MODE': {
  const input = message.trim().toLowerCase();
  let mode = '';
  if (message.trim() === '1' || input.includes('online'))
    mode = 'online';
  else if (message.trim() === '2' || input.includes('offline'))
    mode = 'offline';
  else if (message.trim() === '3' || input.includes('hybrid'))
    mode = 'hybrid';
  else
    return ChatResponseModel.simple(
      'Please choose one of the options:\n\n1. Online\n2. Offline\n3. Hybrid'
    );

  state?.set('quizMode', mode);
  state?.set('step', 'QUIZ_MONTHS');
  return ChatResponseModel.simple(
    `Perfect! How many months can you consistently commit to learning?\n\n` +
    `(Type a number, e.g. 3, 6, 9 etc.)`
  );
}

case 'QUIZ_MONTHS': {
  const input = message.trim();
  const months = parseInt(input);
  if (isNaN(months) || months < 1 || months > 24)
    return ChatResponseModel.simple(
      'Please enter a valid number of months (e.g. 3, 6, 9).'
    );

  state?.set('quizMonths', String(months));
  state?.set('step', 'QUIZ_TIME');
  return ChatResponseModel.simple(
    `Great! Last question — how many hours per week can you commit?\n\n` +
    `1. Less than 5 hours (part-time)\n` +
    `2. 5–10 hours (moderate)\n` +
    `3. More than 10 hours (full focus)`
  );
}

case 'QUIZ_TIME': {
  const lower = message.trim().toLowerCase();
  let time = '';
  if (message.trim() === '1' || lower.includes('less') || lower.includes('part'))
    time = 'LOW';
  else if (message.trim() === '2' || lower.includes('moderate') || lower.includes('5'))
    time = 'MEDIUM';
  else if (message.trim() === '3' || lower.includes('more') || lower.includes('full'))
    time = 'HIGH';
  else
    return ChatResponseModel.simple(
      'Please choose one of the options:\n\n1. Less than 5 hrs/week\n2. 5–10 hrs/week\n3. More than 10 hrs/week'
    );

  state?.set('quizTime', time);
  const level  = state?.get('quizLevel')  ?? '';
  const goal   = state?.get('quizGoal')   ?? '';
  const mode   = state?.get('quizMode')   ?? '';          // ← new
  const months = parseInt(state?.get('quizMonths') ?? '0'); // ← new
  const allCourses = await this.courseRepo.findByStatusTrue();
  const recommendation = this.recommendCourse(level, goal, time, mode, months, allCourses);
  this.sessionState.delete(sessionId);
  return ChatResponseModel.simple(recommendation);
}

      // ── Default ────────────────────────────────────────────────────────────

      default:
        this.sessionState.delete(sessionId);
        return ChatResponseModel.simple(await this.defaultReply());
    }
  }

  // ─── Feature 1 helper — Course recommendation logic ─────────────────────────

private recommendCourse(
  level: string, goal: string, time: string,
  preferredMode: string, availableMonths: number,
  courses: any[]
): string {

  // ── Step 1: Hard filter by MODE ──────────────────────────────────────────
  // hybrid preference accepts all modes; otherwise must match
  let modeFiltered = preferredMode === 'hybrid'
    ? courses
    : courses.filter(c => {
        const courseMode = c.mode?.toLowerCase() ?? '';
        // "hybrid" courses are acceptable for both online & offline seekers
        return courseMode.includes(preferredMode) || courseMode.includes('hybrid');
      });

  if (modeFiltered.length === 0) modeFiltered = courses; // fallback: no match, use all

  // ── Step 2: Hard filter by MONTHS — keep courses student can finish ──────
  // Keep courses whose duration (in months) <= student's available months
  const durationInMonths = (c: any): number => {
    const match = (c.duration ?? '').match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const monthsFiltered = modeFiltered.filter(c => {
    const d = durationInMonths(c);
    return d === 0 || d <= availableMonths; // 0 = unknown duration, don't exclude
  });

  // If nothing fits the months constraint, relax to closest match
  const pool = monthsFiltered.length > 0
    ? monthsFiltered
    : modeFiltered.sort((a, b) => durationInMonths(a) - durationInMonths(b)).slice(0, 2);

  // ── Step 3: Score remaining courses ─────────────────────────────────────
  const scores = new Map<any, number>();

  for (const course of pool) {
    let score = 0;
    const name   = course.name?.toLowerCase()       ?? '';
    const skills = course.skills?.toLowerCase()     ?? '';
    const d      = durationInMonths(course);

    // LEVEL scoring
    if (level === 'BEGINNER') {
      if (name.includes('python') || skills.includes('python')) score += 2;
      if (name.includes('basic')  || name.includes('foundation')) score += 2;
      if (d > 0 && d <= 3) score += 1;
    }
    if (level === 'INTERMEDIATE') {
      if (name.includes('full stack') || skills.includes('full stack')) score += 2;
      if (name.includes('java')       || skills.includes('java'))       score += 2;
    }
    if (level === 'PROFESSIONAL') {
      if (name.includes('advanced')   || skills.includes('advanced'))   score += 2;
      if (d >= 4) score += 1;
    }

    // GOAL scoring
    if (goal === 'JOB') {
      if (course.highlights?.toLowerCase().includes('placement')) score += 3;
      if (course.highlights?.toLowerCase().includes('job'))       score += 3;
      // don't over-reward python when goal is JOB
      if (name.includes('full stack')) score += 4;
      if (name.includes('java'))       score += 3;
      if (name.includes('mern'))       score += 3;
    }
    if (goal === 'UPSKILL') {
      if (name.includes('advanced')   || skills.includes('advanced'))   score += 2;
      if (name.includes('data')       || name.includes('devops'))       score += 2;
      if (name.includes('python')     || name.includes('java'))         score += 1;
    }
    if (goal === 'PROJECT') {
      if (name.includes('mern')       || name.includes('react'))        score += 3;
      if (name.includes('full stack'))                                   score += 3;
      if (skills.includes('project')  || course.highlights?.toLowerCase().includes('project')) score += 2;
    }

    // TIME scoring
    if (time === 'LOW'    && d > 0 && d <= 3) score += 2;
    if (time === 'MEDIUM' && d >= 3 && d <= 6) score += 2;
    if (time === 'HIGH'   && d >= 5)           score += 2;

    // BONUS: closer to student's available months = better fit
    const monthsDiff = Math.abs(d - availableMonths);
    if (monthsDiff === 0) score += 3;
    else if (monthsDiff === 1) score += 2;
    else if (monthsDiff === 2) score += 1;

    scores.set(course, score);
    console.log(`QUIZ SCORE: ${course.name} → ${score} (mode: ${course.mode}, duration: ${course.duration})`);
  }

  // ── Step 4: Pick winner ──────────────────────────────────────────────────
  let recommended = pool[0];
  let maxScore = -1;
  for (const [course, score] of scores.entries()) {
    if (score > maxScore) { maxScore = score; recommended = course; }
  }

  if (!recommended)
    return 'Sorry, no active courses match your preferences right now. Please contact us directly!';

  // ── Step 5: Build response ───────────────────────────────────────────────
  const levelLabel = level === 'BEGINNER' ? 'a complete beginner'
                   : level === 'INTERMEDIATE' ? 'someone with basic coding knowledge'
                   : 'a working professional';
  const goalLabel  = goal === 'JOB'     ? 'landing a job'
                   : goal === 'UPSKILL' ? 'upskilling'
                   : 'building their own projects';
  const modeLabel  = preferredMode === 'online'  ? 'online learning'
                   : preferredMode === 'offline' ? 'offline / in-person classes'
                   : 'hybrid learning';

  let response = `Based on your answers, here's my recommendation! 🎯\n\n`;
  response += `📚 ${recommended.name}\n`;
  if (recommended.duration)   response += `⏱ Duration: ${recommended.duration}\n`;
  if (recommended.mode)       response += `🖥 Mode: ${recommended.mode}\n`;
  if (recommended.skills)     response += `🛠 Skills: ${recommended.skills}\n`;
  if (recommended.highlights) response += `✨ Highlights: ${recommended.highlights}\n`;
  response += `\nThis course is ideal for ${levelLabel} focused on ${goalLabel} via ${modeLabel}.\n\n`;
  response += `Would you like to book a free callback or request more details? 😊`;
  return response;
}
  // ─── Existing helpers (unchanged) ───────────────────────────────────────────

  private fillCourse(template: string | null, course: any): string {
    return template
      ? template
          .replace('{course}', course.name ?? 'N/A')
          .replace('{duration}', course.duration ?? 'N/A')
          .replace('{mode}', course.mode ?? 'N/A')
          .replace('{skills}', course.skills ?? 'N/A')
          .replace('{highlights}', course.highlights ?? 'N/A')
      : this.formatCourseDetail(course);
  }

  private formatCourseDetail(course: any): string {
    let response = `📚 ${course.name}\n`;
    if (course.duration)   response += `Duration: ${course.duration}\n`;
    if (course.mode)       response += `Mode: ${course.mode}\n`;
    if (course.skills)     response += `Skills: ${course.skills}\n`;
    if (course.highlights) response += `Highlights: ${course.highlights}\n`;
    return response;
  }

  private formatCourseList(courses: any[], template: string | null): string {
    if (courses.length === 1 && template) return this.fillCourse(template, courses[0]);
    let response = 'Here are our available courses:\n\n';
    for (const c of courses) {
      response += `📚 ${c.name}`;
      if (c.duration) response += ` — ${c.duration}`;
      if (c.mode)     response += ` (${c.mode})`;
      response += '\n';
    }
    response += '\nType a course name to know more details!';
    return response;
  }

  private formatTrainerList(trainers: any[], template: string | null): string {
    let response = 'Our expert trainers:\n\n';
    for (const t of trainers) {
      response += `👨‍🏫 ${t.name}`;
      if (t.specialization)  response += ` — ${t.specialization}`;
      if (t.experience > 0)  response += ` (${t.experience}+ yrs)`;
      response += '\n';
    }
    return response;
  }

  private fallback(intent: any): string {
    return intent.responseTemplate ?? this.defaultReply();
  }

  private async defaultReply(): Promise<string> {
    const config = await this.configRepo.findByConfigKey('DEFAULT_REPLY');
    return config?.configValue ?? 'Please select an option.';
  }
}