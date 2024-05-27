import { Injectable } from '@nestjs/common';
import { CreateReportDto, reportImageDto } from './dto/create-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateImageReportStatus, UpdateReportStatus } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  //---------- Create Profile Reports ----------
  
  async create(data: CreateReportDto) {
    const existingReport = await this.prisma.profilereport.findFirst({
      where: {
        clientId: data.clientId,
        photographerId: data.photographerId,
      },
    });

    if (existingReport) {
      return await this.prisma.profilereport.update({
        where: {
          id: existingReport.id,
        },
        data: {
          client: {
            connect: {
              userId: data.clientId,
            },
          },
          photographer: {
            connect: {
              userId: data.photographerId,
            },
          },
          subject: data.subject,
          description: data.description,
        },
      });
    } else {
      return await this.prisma.profilereport.create({
        data: {
          client: {
            connect: {
              userId: data.clientId,
            },
          },
          photographer: {
            connect: {
              userId: data.photographerId,
            },
          },
          subject: data.subject,
          description: data.description,
        },
      });
    }
  }

  //------------ Create Image Report --------------------
  async createImageReport(data: reportImageDto) {
    const existingReport = await this.prisma.imagereport.findFirst({
      where: {
        userId: data.userId,
        feedImageId: data.feedImageId,
      },
    });

    if (existingReport) {
      return await this.prisma.imagereport.update({
        where: {
          id: existingReport.id, 
        },
        data: {
          user: {
            connect: {
              id: data.userId,
            },
          },
          feedImage: {
            connect: {
              id: data.feedImageId,
            },
          },
          subject: data.subject,
          description: data.description,
        },
      });
    } else {
      return await this.prisma.imagereport.create({
        data: {
          user: {
            connect: {
              id: data.userId,
            },
          },
          feedImage: {
            connect: {
              id: data.feedImageId,
            },
          },

          subject: data.subject,
          description: data.description,
        },
      });
    }
  }
  //------------- Update Image Report Status --------------

  async updateImageReportStatus( data: UpdateImageReportStatus) {
    const report = await this.prisma.imagereport.findUnique({
      where: {
        id: data.ImageReportId,
      },
    });

    if (!report) {
      throw new Error(`payment with id not found`);
    } else {
      const reportUpdate = await this.prisma.imagereport.update({
        where: {
          id: data.ImageReportId,
        },
        data: {
          status: data.status,
        },
      });
      return reportUpdate;
    }
  }

    //------------- Update  Report Status --------------


  async updateReportStatus( data: UpdateReportStatus) {
    const report = await this.prisma.profilereport.findUnique({
      where: {
        id: data.ReportId,
      },
    });

    if (!report) {
      throw new Error(`payment with id not found`);
    } else {
      const reportUpdate = await this.prisma.profilereport.update({
       
        where: {
          id: data.ReportId,
        },
        data: {
          status: data.status,
        },
      });
      return reportUpdate;
    }
  }



  //-------- Admin panel profile Reports --------------------------------

  async findall(page: number, name: string) {
    const pageSize = 4;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let whereClause = {}; 

    if (name) {
      whereClause = {
        photographer: {
          user: {
            userName: {
              contains: name,
              mode: 'insensitive',
            },
          },
        },
      }; // If name is provided, filter by photographer user-name
    }

    const values = await this.prisma.profilereport.findMany({
      skip, //how many rows to skip
      take, //how many rows to get /fetch
      where: whereClause,
      include: {
        photographer: {
          include: {
            user: true,
          },
        },
        client: {
          include: {
            user: true,
          },
        },
      },
    });
    return values;
  }

  async findLastPage(name: string) {
    const pageSize = 4;
    let whereClause = {};

    if (name) {
      whereClause = {
        photographer: {
          user: {
            userName: {
              contains: name,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    const total = await this.prisma.profilereport.count({
      where: whereClause,
    });
    const lastPage = Math.ceil(total / pageSize);
    return lastPage;
  }




  // ------ Admin Panel Image Reports --------------------------------

  async findallImageReports(page: number, name: string) {
    const pageSize = 4;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let whereClause = {}; //where to get search results

    if (name) {
      whereClause = {
          user: {
            userName: {
              contains: name,
              mode: 'insensitive',
            },
          },
      }; // If name is provided, filter by photographer user-name
    }

    const values = await this.prisma.imagereport.findMany({
      skip, 
      take, 
      where: whereClause,
      include: {
        user: true,
        feedImage: true,
      },
    });
    return values;
  }

  async findLastImageReportPage(name: string) {
    const pageSize = 4;
    let whereClause = {};

    if (name) {
      whereClause = {
          user: {
            userName: {
              contains: name,
              mode: 'insensitive',
            },
          },
      };
    }

    const total = await this.prisma.imagereport.count({
      where: whereClause,
    });
    const lastPage = Math.ceil(total / pageSize);
    return lastPage;
  }
}
