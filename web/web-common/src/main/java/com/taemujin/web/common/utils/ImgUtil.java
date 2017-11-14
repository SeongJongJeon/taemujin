package com.taemujin.web.common.utils;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifIFD0Directory;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

/**
 * 이미지가 회전해 있는 경우 원래대로 변환
 */
public class ImgUtil {
    public static File checkRotate(MultipartFile mediaFile, String extention) {
        File file = new File(mediaFile.getOriginalFilename());
        int orientation = 1;
        try {
            byte[] imgBytes = mediaFile.getBytes();
            BufferedInputStream bufferedIS = new BufferedInputStream(new ByteArrayInputStream(imgBytes));

            Metadata metadata = ImageMetadataReader.readMetadata(bufferedIS);
            Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            orientation = directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);


            ByteArrayInputStream byteIS = new ByteArrayInputStream(imgBytes);
            BufferedImage bufferedImage = rotateImage(byteIS, orientation);

            //이미지 압축 (메모리 많이 먹음)
//            ResampleOp resampleOp = new ResampleOp(bufferedImage.getWidth(), bufferedImage.getHeight());
//            resampleOp.setUnsharpenMask(AdvancedResizeOp.UnsharpenMask.None);
//            BufferedImage rescaleadImage = resampleOp.filter(bufferedImage, null);
            ImageIO.write(bufferedImage, extention, file);
        } catch (Exception e) {
            return null;
        }
        return file;
    }

    private static BufferedImage rotateImage(InputStream is, int orientation) throws IOException {
        BufferedImage bi = ImageIO.read(is);
        if (orientation == 6) {
            return rotateImage(bi, 90);
        } else if (orientation == 1) { //왼쪽으로 눞였을때
            return bi;
        } else if (orientation == 3) {//오른쪽으로 눞였을때
            return rotateImage(bi, 180);
        } else if (orientation == 8) {//180도
            return rotateImage(bi, 270);
        } else { //정위치
            return bi;
        }
    }

    private static BufferedImage rotateImage(BufferedImage orgImage, int radians) {
        BufferedImage newImage;
        if (radians == 90 || radians == 270) {
            newImage = new BufferedImage(orgImage.getHeight(), orgImage.getWidth(), orgImage.getType());
        } else if (radians == 180) {
            newImage = new BufferedImage(orgImage.getWidth(), orgImage.getHeight(), orgImage.getType());
        } else {
            return orgImage;
        }
        Graphics2D graphics = (Graphics2D) newImage.getGraphics();
        graphics.rotate(Math.toRadians(radians), newImage.getWidth() / 2, newImage.getHeight() / 2);
        graphics.translate((newImage.getWidth() - orgImage.getWidth()) / 2, (newImage.getHeight() - orgImage.getHeight()) / 2);
        graphics.drawImage(orgImage, 0, 0, orgImage.getWidth(), orgImage.getHeight(), null);

        return newImage;
    }
}
