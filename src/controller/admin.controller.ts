import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param
} from '@nestjs/common';
import { AdminService } from '../service/admin/admin.service';

@Controller('api/admin')
export class AdminController {

  constructor(private adminService: AdminService) {}

  @Post('/add')
  add(@Body() body: any) {
    return this.adminService.addAdmin(body.username, body.password);
  }

  @Get('/list')
  list() {
    return this.adminService.getAdmins();
  }

  @Post('/toggle/:id')
  toggle(@Param('id') id: number) {
    return this.adminService.toggleAdmin(id);
  }

  @Post('/reset')
  reset(@Body() body: any) {
    return this.adminService.resetPassword(body.id, body.password);
  }

  @Get('/activity')
  activity() {
    return this.adminService.getActivity();
  }

  @Put('/update/:id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.adminService.updateAdmin(id, body.username);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.adminService.deleteAdmin(id);
  }

    @Put('/update/:id')
    updateAdmin(
      @Param('id') id: number,
      @Body() body: any
    ) {
      return this.adminService.updateAdmin(id, body.username);
    }

}