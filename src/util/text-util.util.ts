export class TextUtil {
  private static readonly STOPWORDS = new Set([
    'i', 'me', 'my', 'we', 'our', 'you', 'your',
    'is', 'are', 'am', 'was', 'were', 'be', 'been',
    'a', 'an', 'the', 'this', 'that', 'these', 'those',
    'to', 'of', 'in', 'on', 'at', 'for', 'with', 'about',
    'do', 'does', 'did', 'can', 'could', 'will', 'would',
    'what', 'how', 'when', 'where', 'who', 'which', 'why',
    'please', 'tell', 'show', 'give', 'get', 'want', 'need',
    'u', 'ur', 'provide', 'have', 'has', 'its', 'it',
    'yes', 'no', 'ok', 'okay', 'hi', 'hey', 'hello', 'bye',
    'thanks', 'thank', 'sorry',

  ]);


  private static readonly INAPPROPRIATE_WORDS = new Set([
    'flirt', 'flirting', 'sex', 'sexy', 'love', 'hate',
    'kiss', 'dating', 'marry', 'nude', 'naked',
  ]);

  private static readonly INAPPROPRIATE_PHRASES = [
    /\bi\s+love\s+(you|u)\b/i,
    /\bi\s+(like|fancy)\s+(you|u)\b/i,
    /\bare\s+you\s+(single|available|dating)\b/i,
    /\bwill\s+you\s+(date|marry)\s+me\b/i,
    /\byou\s+(are|re)\s+(cute|hot|beautiful)\b/i,
  ];


  static isInappropriate(message: string): boolean {
    const cleaned = message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    const words = cleaned.split(/\s+/);

    if (words.some(w => this.INAPPROPRIATE_WORDS.has(w))) return true;
    if (this.INAPPROPRIATE_PHRASES.some(p => p.test(message))) return true;

    return false;
  }

  static extract(message: string): string[] {
    if (!message || message.trim() === '') return [];
    const cleaned = message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned.split(' ').filter(word => word.trim() !== '' && !this.STOPWORDS.has(word));
  }

  static clean(message: string): string {
    if (!message) return '';
    return message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
}