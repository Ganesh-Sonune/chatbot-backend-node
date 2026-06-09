import {
  Injectable,
  BadRequestException
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdminService } from '../admin.service';
import { User } from 'src/entity/user.entity';
import { Role } from 'src/enums/role.enum';
import { AdminActivity } from 'src/entity/admin-activity.entity';

@Injectable()
export class AdminServiceImpl extends AdminService {

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(AdminActivity)
    private activityRepo: Repository<AdminActivity>
  ) {
    super();
  }

  // ---------------- ADD ADMIN ----------------
  async addAdmin(username: string, password: string) {

    const existing = await this.userRepo.findOne({
      where: { username }
    });

    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    const hash = await bcrypt.hash(password, 10);

    const admin = await this.userRepo.save({
      username,
      password: hash,
      role: Role.ROLE_ADMIN,
      enabled: true
    });

    await this.log(
      admin.id,
      'CREATE_ADMIN',
      'New admin created'
    );

    return admin;
  }

  // ---------------- GET ADMINS ----------------
  async getAdmins() {
    return this.userRepo.find({
      where: { role: Role.ROLE_ADMIN },

      // newest admin first
      order: {
        id: 'DESC'
      }
    });
  }

  // ---------------- TOGGLE ADMIN ----------------
  async toggleAdmin(id: number) {

    const admin = await this.userRepo.findOneBy({ id });

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    admin.enabled = !admin.enabled;

    await this.userRepo.save(admin);

    await this.log(
      id,
      'TOGGLE_ADMIN',
      'Admin status changed'
    );

    return admin;
  }

  // ---------------- RESET PASSWORD ----------------
  async resetPassword(id: number, password: string) {

    const admin = await this.userRepo.findOneBy({ id });

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const hash = await bcrypt.hash(password, 10);

    await this.userRepo.update(id, {
      password: hash
    });

    await this.log(
      id,
      'RESET_PASSWORD',
      'Password updated'
    );

    return {
      message: 'Password updated'
    };
  }

  // ---------------- ACTIVITY ----------------
  async getActivity() {
    return this.activityRepo.find({
      order: {
        id: 'DESC'
      }
    });
  }

  // ---------------- LOGGER ----------------
  private async log(
    adminId: number,
    action: string,
    description: string
  ) {
    await this.activityRepo.save({
      admin_id: adminId,
      action,
      description
    });
  }
}