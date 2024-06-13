import { Controller, Get, Query,Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
    private readonly logger = new Logger(AdminController.name);

    constructor(private adminService: AdminService) { }

    @Get('getallusers')
    async getAllUsers
        (@Query('page') page: number,
            @Query('name') name: string,
            @Query('roles') roles: string) {
                this.logger.log(`Fetching all users with page: ${page}, name: ${name}, roles: ${roles}`);

                try {
                  const users = await this.adminService.findAll(page, name, roles);
                  this.logger.log(`Successfully fetched users. Count: ${users.length}`);
                  return users;
                } catch (error) {
                  this.logger.error(`Failed to fetch users with page: ${page}, name: ${name}, roles: ${roles}`, error.stack);
                  throw new HttpException('Error fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
                }
    }

    @Get('getlastpage')
    async getLastPage(@Query('name') name: string,@Query('roles') roles: string){
        this.logger.log(`Fetching last page for users with name: ${name}, roles: ${roles}`);

        try {
          const lastPage = await this.adminService.findLastPage(name, roles);
          this.logger.log(`Successfully fetched last page: ${lastPage}`);
          return lastPage;
        } catch (error) {
          this.logger.error(`Failed to fetch last page with name: ${name}, roles: ${roles}`, error.stack);
          throw new HttpException('Error fetching last page', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
