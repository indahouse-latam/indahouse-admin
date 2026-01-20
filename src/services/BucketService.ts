export class BucketService {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    async uploadImages(fileList: FileList | File[], token: string): Promise<string[]> {
        try {
            const files = Array.isArray(fileList) ? fileList : Array.from(fileList);
            const formData = new FormData();
            formData.append('userId', this.userId.toString());
            files.forEach((file) => {
                formData.append('files', file, file.name); // Note: 'files' should be consistent for all appended files
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadImages`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    UserId: this.userId.toString(),
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload images');
            }

            const responseData = await response.json();

            return responseData.urls;
        } catch (error) {
            console.error('Error uploading files:', (error as Error).message || error);
            throw error;
        }
    }
}
