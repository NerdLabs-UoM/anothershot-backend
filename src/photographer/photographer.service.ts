import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { TestimonialVisibility } from '@prisma/client';
import { VisibilityDto } from './dto/visibility.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import { Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { FeedDto } from './dto/feed.dto';
import { FeedLikeDto } from './dto/feedLike.dto';
import { FeedSaveDto } from './dto/feedSave.dto';
import { DeleteFeedDto } from './dto/deleteFeed.dto';
import { CaptionDto } from './dto/caption.dto';
@Injectable()
export class PhotographerService {
  constructor(private prisma: PrismaService) { }

  async createTestimonial(dto: CreateTestimonialDto) {
    const existingTestimonial = await this.prisma.testimonial.findFirst({
      where: {
        photographerId: dto.photographerId,
        clientId: dto.clientId,
      },
    });

    if (existingTestimonial) {
      return await this.updateTestimonial(existingTestimonial.id, dto);
    } else {
      return await this.prisma.testimonial.create({
        data: {
          review: dto.review,
          rating: dto.rating,
          photographer: { connect: { userId: dto.photographerId } },
          client: { connect: { userId: dto.clientId } },
        },
      });
    }
  }

  async updateTestimonial(id: string, dto: CreateTestimonialDto) {
    return await this.prisma.testimonial.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
  }

  async getTestimonials(photographerId: string) {
    return await this.prisma.testimonial.findMany({
      where: {
        photographerId: photographerId,
      },
      select: {
        id: true,
        review: true,
        rating: true,
        visibility: true,
        client: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async updateTestimonialVisibility(dto: VisibilityDto) {
    const testimonials = await this.prisma.testimonial.findMany({
      where: {
        id: { in: dto.testimonialId },
      },
      select: {
        id: true,
        visibility: true,
      },
    });
    const updatePromises = testimonials.map((testimonial) => {
      return this.prisma.testimonial.update({
        where: { id: testimonial.id },
        data: {
          visibility:
            testimonial.visibility === TestimonialVisibility.PUBLIC
              ? TestimonialVisibility.PRIVATE
              : TestimonialVisibility.PUBLIC,
        },
      });
    });

    await Promise.all(updatePromises);
  }


  async findAll() {
    return await this.prisma.photographer.findMany({
      include: {
        user: true
      }
    });
  }

  async getContactDetails(id: string) {
    return this.prisma.contactDetails.findUnique({
      where: {
        photographerId: id,
      },
      include: {
        address: true,
        socialMedia: true,
      },
    });
  }
  async updateContactDetails(dto: contactDetailsDto) {
    const tempUserId = dto.userId;
    const existingContactDetails = await this.prisma.contactDetails.findUnique({
      where: { photographerId: dto.userId },
    });

    if (existingContactDetails) {
      await this.prisma.contactDetails.update({
        where: { photographerId: dto.userId },
        data: {
          phoneNum1: dto.phoneNum1,
          phoneNum2: dto.phoneNum2,
          email: dto.email,
          address: dto.address
            ? {
              upsert: {
                where: { contactDetailsId: existingContactDetails.id },
                create: { ...dto.address },
                update: { ...dto.address },
              },
            }
            : undefined,
          socialMedia: dto.socialMedia
            ? {
              upsert: {
                where: { contactDetailsId: existingContactDetails.id },
                create: { ...dto.socialMedia },
                update: { ...dto.socialMedia },
              },
            }
            : undefined,
        },
      });
    } else {
      await this.prisma.contactDetails.create({
        data: {
          photographer: {
            connect: {
              userId: dto.userId,
            }
          },
          phoneNum1: dto.phoneNum1,
          phoneNum2: dto.phoneNum2,
          email: dto.email,
          address: dto.address
            ? { create: { ...dto.address } }
            : undefined,
          socialMedia: dto.socialMedia
            ? { create: { ...dto.socialMedia } }
            : undefined,
        },
      });
    }

    return await this.prisma.contactDetails.findUnique({
      where: { photographerId: dto.userId },
      include: {
        photographer: true,
        address: true,
        socialMedia: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.photographer.findUnique({
      where: {
        userId: id,
      },
      include: {
        user: true,
      },
    });
  }

  async updateUser(userId: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: { userId: userId },
      data,
    });
  }


  async updateProfilePicture(userId: string, data: Partial<Photographer & { image: string }>) {
    return await this.prisma.photographer.update({

      where: {
        userId: userId // Use the userId parameter passed to the method
      },
      include: {
        user: true,
      },
      data: {
        user: { // Since image is a property of the user object, you need to update it within the user object
          update: {
            image: data.image // Set the image property to the value provided in the data parameter
          }
        }
      }
    });
  }

  async updateCoverPhoto(userId: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: {
        userId: userId // Use the userId parameter passed to the method
      }, data
    });
  }
  async getFeed(id: string, clientId: string) {
    return await this.prisma.feedImage.findMany({
      where: {
        photographerId: id,
      },
      select: { 
        id: true,
        image: true,
        likeCount: true,
        saveCount: true,
        caption: true,
        photographer : {
          select: {
            name: true,
            user: {
              select: {
                image: true,
              }
            }
          }
        },
        likes: {
          where: {
            clientId: clientId,
          },
          select: {
            isliked: true,
          },
          take: 1,
        },
        saves: {
          where: {
            clientId: clientId,
          },
          select: {
            issaved: true,
          },
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
  }
  async createFeedComponent(dto: FeedDto) {
    return await this.prisma.feedImage.create({
      data:{
        // caption: dto.caption,
        image: dto.image,
        photographer: {
          connect: {
            userId: dto.photographerId
          }
        }
      }
    });
  }
  async feedLike(dto: FeedLikeDto) {
    // Check if the like exists for the given feedImageId and clientId
    const existingLike = await this.prisma.likedImages.findFirst({
        where: {
            clientId: dto.clientId,
            feedImageId: dto.feedId
        }
    });

    // Get the current like count for the feed image
    const feed = await this.prisma.feedImage.findUnique({
        where: {
            id: dto.feedId
        },
        select: {
            id: true,
            likeCount: true
        }
    });
    let likeCount = feed.likeCount;

    if (dto.like) {
        // If like is true, create a new like and increment the like count
        if (!existingLike) {
            await this.prisma.likedImages.create({
                data: {
                    feedImage: {
                        connect: {
                            id: dto.feedId
                        }
                    },
                    client: {
                        connect: {
                            userId: dto.clientId
                        }
                    }
                }
            });
            likeCount++;
        }
    } else {
        // If like is false, delete the existing like and decrement the like count
        if (existingLike) {
            await this.prisma.likedImages.delete({
                where: {
                    id: existingLike.id
                }
            });
            likeCount--;
        }
    }

    // Update the like count for the feed image
    return await this.prisma.feedImage.update({
        where: {
            id: dto.feedId
        },
        data: {
            likeCount: likeCount
        }
    });
}
async feedSave(dto: FeedSaveDto) {
  // Check if the like exists for the given feedImageId and clientId
  const existingSave = await this.prisma.savedImages.findFirst({
      where: {
          clientId: dto.clientId,
          feedImageId: dto.feedId
      }
  });

  // Get the current like count for the feed image
  const feed = await this.prisma.feedImage.findUnique({
      where: {
          id: dto.feedId
      },
      select: {
          id: true,
          saveCount: true
      }
  });
  let saveCount = feed.saveCount;

  if (dto.save) {
      // If like is true, create a new like and increment the like count
      if (!existingSave) {
          await this.prisma.savedImages.create({
              data: {
                  feedImage: {
                      connect: {
                          id: dto.feedId
                      }
                  },
                  client: {
                      connect: {
                          userId: dto.clientId
                      }
                  }
              }
          });
          saveCount++;
      }
  } else {
      // If like is false, delete the existing like and decrement the like count
      if (existingSave) {
          await this.prisma.savedImages.delete({
              where: {
                  id: existingSave.id
              }
          });
          saveCount--;
      }
  }

  // Update the like count for the feed image
  return await this.prisma.feedImage.update({
      where: {
          id: dto.feedId
      },
      data: {
          saveCount: saveCount
      }
  });
}
  async deleteFeed(dto: DeleteFeedDto) {
    return await this.prisma.feedImage.delete({
      where: {
        id: dto.feedId,
      }
    });
  }
  async getFeedHeader(id: string) {
    return await this.prisma.photographer.findUnique({
      where: {
        userId: id
      },
      select: {
        name: true,
        user: {
          select: {
            image: true
          }
        }
      }
    });
  }
  async updateCaption(dto: CaptionDto) {
    return await this.prisma.feedImage.update({
      where: {
        id: dto.feedId
      },
      data: {
        caption: dto.caption
      }
    });
  }
}
