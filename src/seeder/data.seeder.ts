import { Injectable,OnModuleInit }from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User }from '../entity/user.entity';

import { Role }from '../enums/role.enum';

import { UserRepository }from '../repository/user.repository';

@Injectable()
export class DataSeeder implements OnModuleInit {

  constructor(private readonly userRepo:UserRepository,) {}

  async onModuleInit():Promise<void> {

      console.log('Seeder running...');

    const existingUser=await this.userRepo.findByUsername('admin',);

    if(existingUser){return;}

    const admin=new User();

    admin.username='admin';

    admin.password=await bcrypt.hash('admin123',10,);

    admin.role=Role.ROLE_ADMIN;

    admin.enabled=true;

    await this.userRepo.save(admin,);

    console.log('Admin user seeded.',);
  }

}