import {MediaUriTypeEnum} from "./media-uri-type-enum";
import {FileMetadataDto, FileToUpload} from "./FileUpload";

export class FileUtils {
    static getMediaTypeFromFile(file: File): MediaUriTypeEnum {
        const type = file.type.toLowerCase();

        if (type.includes('image')) {
            if (type.includes('gif')) return MediaUriTypeEnum.GIF;
            return MediaUriTypeEnum.IMAGE;
        }

        if (type.includes('video')) return MediaUriTypeEnum.VIDEO;
        if (type.includes('audio')) return MediaUriTypeEnum.AUDIO;
        if (type.includes('application/') || type.includes('text/')) {
            return MediaUriTypeEnum.DOCUMENT;
        }

        return MediaUriTypeEnum.UNKNOWN;
    }

    static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
                URL.revokeObjectURL(img.src);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    static async getVideoDimensions(file: File): Promise<{ width: number; height: number; duration: number }> {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.onloadedmetadata = () => {
                resolve({
                    width: video.videoWidth,
                    height: video.videoHeight,
                    duration: video.duration
                });
                URL.revokeObjectURL(video.src);
            };
            video.onerror = reject;
            video.src = URL.createObjectURL(file);
        });
    }

    static async getAudioDuration(file: File): Promise<number> {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
                URL.revokeObjectURL(audio.src);
            };
            audio.onerror = reject;
            audio.src = URL.createObjectURL(file);
        });
    }

    static async processFile(file: File, position?: number, useCaseType?: any): Promise<FileToUpload> {
        const mediaType = this.getMediaTypeFromFile(file);
        const fileUrl = URL.createObjectURL(file);

        const fileToUpload: FileToUpload = {
            file,
            fileUrl,
            mediaUriType: mediaType,
            position
        };

        try {
            switch (mediaType) {
                case MediaUriTypeEnum.IMAGE:
                case MediaUriTypeEnum.GIF:
                    const { width, height } = await this.getImageDimensions(file);
                    fileToUpload.width = width;
                    fileToUpload.height = height;
                    break;

                case MediaUriTypeEnum.VIDEO:
                    const videoData = await this.getVideoDimensions(file);
                    fileToUpload.width = videoData.width;
                    fileToUpload.height = videoData.height;
                    fileToUpload.duration = videoData.duration;
                    break;

                case MediaUriTypeEnum.AUDIO:
                    const duration = await this.getAudioDuration(file);
                    fileToUpload.duration = duration;
                    break;
            }
        } catch (error) {
            console.warn('Error processing file metadata:', error);
        }

        // Generate metadata if position is provided
        if (position !== undefined) {
            fileToUpload.metadata = this.createFileMetadata(fileToUpload, position, useCaseType);
        }

        return fileToUpload;
    }

    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    static createFileMetadata<T = any>(
        file: FileToUpload,
        position: number,
        useCaseType?: T
    ): FileMetadataDto<T> {
        return {
            mediaUriType: file.mediaUriType,
            mediaUriUseCaseType: useCaseType,
            width: file.width,
            height: file.height,
            duration: file.duration,
            size: file.file.size,
            position,
            mimeType: file.file.type,
            originalName: file.file.name
        };
    }

    static generateMetadataForFiles<T = any>(
        files: FileToUpload[],
        useCaseType?: T
    ): FileToUpload[] {
        return files.map((file, index) => ({
            ...file,
            position: index,
            metadata: this.createFileMetadata(file, index, useCaseType)
        }));
    }

    static updateFilePositions<T = any>(
        files: FileToUpload[],
        useCaseType?: T
    ): FileToUpload[] {
        return files.map((file, index) => ({
            ...file,
            position: index,
            metadata: file.metadata ?
                { ...file.metadata, position: index } :
                this.createFileMetadata(file, index, useCaseType)
        }));
    }
}