export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (err: Error | null, bool: boolean) => void,
) => {
  if (!file) return cb(new Error('File is Empty'), false);
  const fileExtension: string = file.mimetype.split('/')[1];
  const validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif'];
  if (validExtensions.includes(fileExtension)) {
    return cb(null, true);
  }
  cb(null, true);
};
