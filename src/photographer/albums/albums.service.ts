import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AlbumImagesDto,
  AlbumsDto,
  UpdateAlbumCoverDto,
  updateAlbumDto,
} from '../dto/album.dto';

@Injectable()
export class AlbumsService {
  private readonly logger = new Logger(AlbumsService.name);

  constructor(private prisma: PrismaService) {}

  async createAlbum(dto: AlbumsDto) {
    this.logger.log(
      `Attempting to create a new album for photographer with ID: ${dto.photographerId}`
    );

    try {
      // Creating a new album in the database with the provided details
      const newAlbum = await this.prisma.album.create({
        data: {
          name: dto.name,
          description: dto.description,
          visibility: dto.visibility,
          price: dto.price,
          photographer: {
            connect: {
              userId: dto.photographerId,
            },
          },
        },
        include: {
          images: true, // Includes related images in the response
        },
      });

      this.logger.log(
        `Successfully created album '${dto.name}' for photographer with ID: ${dto.photographerId}`
      );
      return newAlbum;
    } catch (error) {
      this.logger.error(
        `Failed to create album '${dto.name}' for photographer with ID: ${dto.photographerId}`,
        error.stack
      );

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error creating album',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async editAlbum(dto: updateAlbumDto) {
    try {
      // Updating the album in the database with the provided details
      const updatedAlbum = await this.prisma.album.update({
        where: {
          id: dto.albumId,
        },
        data: {
          name: dto.name,
          description: dto.description,
          visibility: dto.visibility,
          price: dto.price,
        },
      });

      this.logger.log(`Successfully updated album with ID: ${dto.albumId}`);
      return updatedAlbum;
    } catch (error) {
      this.logger.error(
        `Failed to update album with ID: ${dto.albumId}`,
        error.stack
      );

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error updating album',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAlbums(id: string) {
    this.logger.log(
      `Attempting to fetch all albums for photographer with ID: ${id}`
    );

    try {
      // Fetching all albums for the specified photographer ID, including associated images
      const albums = await this.prisma.album.findMany({
        where: {
          photographerId: id,
        },
        include: {
          images: true, // Includes related images in the response
        },
      });

      this.logger.log(
        `Successfully fetched ${albums.length} albums for photographer with ID: ${id}`
      );
      return albums;
    } catch (error) {
      this.logger.error(
        `Failed to fetch albums for photographer with ID: ${id}`,
        error.stack
      );

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error fetching albums',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAlbum(id: string) {
    this.logger.log(`Attempting to fetch album with ID: ${id}`);

    try {
      // Fetching the album from the database by its ID
      const album = await this.prisma.album.findMany({
        where: {
          id: id,
        },
      });
      this.logger.log(`Successfully fetched album with ID: ${id}`);
      return album;
    } catch (error) {
      this.logger.error(`Failed to fetch album with ID: ${id}`, error.stack);

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error fetching album',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getImages(id: string) {
    this.logger.log(`Attempting to fetch images for album with ID: ${id}`);

    try {
      // Fetching all images associated with the specified album ID
      const images = await this.prisma.albumImage.findMany({
        where: {
          albumId: id,
        },
        include: {
          album: true,
        },
      });

      this.logger.log(
        `Successfully fetched ${images.length} images for album with ID: ${id}`
      );
      return images;
    } catch (error) {
      this.logger.error(
        `Failed to fetch images for album with ID: ${id}`,
        error.stack
      );
      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error fetching images',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAlbum(id: string) {
    this.logger.log(`Attempting to delete album with ID: ${id}`);

    try {
      // Deleting the album with the specified ID
      const deletedAlbum = await this.prisma.album.delete({
        where: {
          id: id,
        },
      });

      this.logger.log(`Successfully deleted album with ID: ${id}`);
      return deletedAlbum;
    } catch (error) {
      this.logger.error(`Failed to delete album with ID: ${id}`, error.stack);

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error deleting album',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addImages(dto: AlbumImagesDto) {
    this.logger.log(
      `Attempting to add images to album with ID: ${dto.albumId}`
    );

    try {
      // Checking if the album exists
      await this.prisma.album.findUnique({
        where: {
          id: dto.albumId,
        },
      });

      const images = await Promise.all(
        dto.images.map((imageUrl) =>
          this.prisma.albumImage.create({
            data: {
              image: imageUrl,
              album: {
                connect: {
                  id: dto.albumId,
                },
              },
            },
          })
        )
      );

      this.logger.log(
        `Successfully added ${dto.images.length} images to album with ID: ${dto.albumId}`
      );
      return images;
    } catch (error) {
      this.logger.error(
        `Failed to add images to album with ID: ${dto.albumId}`,
        error.stack
      );

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error adding images to album',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteImage(id: string) {
    this.logger.log(`Attempting to delete image with ID: ${id}`);

    try {
      // Deleting the image with the specified ID
      const deletedImage = await this.prisma.albumImage.delete({
        where: {
          id: id,
        },
      });

      this.logger.log(`Successfully deleted image with ID: ${id}`);
      return deletedImage;
    } catch (error) {
      this.logger.error(`Failed to delete image with ID: ${id}`, error.stack);

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error deleting image',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateAlbumCover(dto: UpdateAlbumCoverDto) {
    this.logger.log(
      `Attempting to update cover image for album ID: ${dto.albumId}`
    );

    try {
      // Check if the album exists
      const album = await this.prisma.album.findUnique({
        where: { id: dto.albumId },
      });

      if (!album) {
        this.logger.warn(`Album with ID ${dto.albumId} not found`);
        throw new NotFoundException(`Album with ID ${dto.albumId} not found`);
      }

      // Update the album's cover image
      const updatedAlbum = await this.prisma.album.update({
        where: { id: dto.albumId },
        data: { coverImage: dto.coverImage },
      });

      this.logger.log(
        `Cover image updated successfully for album ID: ${dto.albumId}`
      );
      return updatedAlbum;
    } catch (error) {
      this.logger.error(
        `Error updating cover image for album ID: ${dto.albumId}`,
        error.stack
      );
      throw error; // Re-throw the error to be handled by the controller
    }
  }

  async getPaymentStatus(userId: string, albumId: string) {
    this.logger.log(
      `Attempting to get payment status for album ID: ${albumId} for user ID: ${userId}`
    );
    try {
      return await this.prisma.albumPayment.findUnique({
        where: {
          clientId: userId,
          albumId: albumId,
        },
        select: {
          status: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching payment status for album ID: ${albumId} and user ID: ${userId}`
      );
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
