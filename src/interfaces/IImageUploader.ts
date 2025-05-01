export interface IImageUploader {
    file?: File | null;
    setFile: (file: File | null) => void;
}