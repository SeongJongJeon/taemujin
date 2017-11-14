package com.taemujin.core.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;
import org.springframework.util.StringUtils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.KeySpec;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.TreeMap;

/**
 * 암호화 방식들을 모아놓은 클래스이다.
 * <p>
 * - AES 자바스크립트 참조 : https://github.com/mpetersen/aes-example/blob/master/src/test/javascript/AesUtilSpec.js
 * - AES 자바스크립트 위치
 * -- top/src/main/resources/static/thirdparty/crypto/*
 * -- front-src/dev/js/utils/integrationUtil.js > CryptoUtil
 */
@Slf4j
public class CryptUtil {
    private static final int AES_DEFAULT_KEY_SIZE = 128;
    private static final int AES_DEFAULT_ITERATION_COUNT = 1;
    private static final String AES_DEFAULT_PASSPHRASE = "momnby_success!!";
    private static final String AES_DEFAULT_IV = "F27D5C9927726BCEFE7510B1BDD3D137";
    private static final String AES_DEFAULT_SALT = "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";
    private static char[] BASE62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".toCharArray();

    private static SecretKey generateKeyOfAes(String salt, String passphrase) throws Exception {
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        KeySpec spec = new PBEKeySpec(passphrase.toCharArray(), Hex.decodeHex(salt.toCharArray()), AES_DEFAULT_ITERATION_COUNT, AES_DEFAULT_KEY_SIZE);
        SecretKey key = new SecretKeySpec(factory.generateSecret(spec).getEncoded(), "AES");
        return key;
    }

    private static byte[] doFinalOfAes(Cipher cipher, int encryptMode, SecretKey key, String iv, byte[] bytes) throws Exception {
        cipher.init(encryptMode, key, new IvParameterSpec(Hex.decodeHex(iv.toCharArray())));
        return cipher.doFinal(bytes);
    }

    /**
     * AES를 이용한 암호화
     *
     * @param plaintext
     * @return
     */
    public static String encryptAes(String plaintext, boolean urlEncode) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKey key = generateKeyOfAes(AES_DEFAULT_SALT, AES_DEFAULT_PASSPHRASE);
            byte[] encrypted = doFinalOfAes(cipher, Cipher.ENCRYPT_MODE, key, AES_DEFAULT_IV, plaintext.getBytes("UTF-8"));
            String encryptedValue = Base64.encodeBase64String(encrypted);

            if (urlEncode && encryptedValue != null) {
                return URLEncoder.encode(encryptedValue, "UTF-8");
            }
            return encryptedValue;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * AES를 이용한 복호화
     *
     * @param ciphertext
     * @return
     */
    public static String decryptAes(String ciphertext) {
        try {
            //URL 디코딩
            ciphertext = URLDecoder.decode(ciphertext, "UTF-8");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKey key = generateKeyOfAes(AES_DEFAULT_SALT, AES_DEFAULT_PASSPHRASE);
            byte[] decrypted = doFinalOfAes(cipher, Cipher.DECRYPT_MODE, key, AES_DEFAULT_IV, Base64.decodeBase64(ciphertext));
            return new String(decrypted, "UTF-8");
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 접속 사용자 아이디를 AES로 인코딩 하여 리턴
     *
     * @param userId
     * @return
     */
    public static String generateUserIdToCookie(long userId) {
        Date date = new Date();
        return encryptAes(String.format("%s_%s_%s", date.getTime(), userId, date.getTime()), true);
    }

    /**
     * AES로 암호화된 쿠키값을 디코딩하여 사용자 ID값 추출
     *
     * @param cookie
     * @return
     */
    public static long generateCookieToUserId(String cookie) {
        if (StringUtils.isEmpty(cookie)) {
            return 0;
        }

        String originVal = decryptAes(cookie);
        return Long.parseLong(originVal.split("_")[1]);
    }


    /**
     * 패스워드를 Sha256으로 변환하여 리턴한다
     *
     * @param pwd
     * @return
     */
    public static String generatePasswordWithSha256(String pwd) {
        return encryptSha256(pwd);
    }

    /**
     * Sha256을 이용한 암호화 (복호화 불가능)
     *
     * @param data
     * @return
     */
    public static String encryptSha256(String data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(data.getBytes(), 0, data.length());
            return new BigInteger(1, md.digest()).toString(16);
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }

    /**
     * 이니시스 사용 - Map에 저장된 순서대로 key=value 쌍의 스트링을 생성한 뒤 Sha256으로 암호화
     *
     * @param signParam
     * @return
     */
    public static String encryptSha256OfSignature(TreeMap signParam) {
        if (signParam == null || signParam.size() == 0) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        Iterator<?> iter = signParam.keySet().iterator();
        while (iter.hasNext()) {
            String name = (String) iter.next();
            sb.append(String.format("%s=%s&", name, signParam.get(name)));
        }
        String params = sb.toString();
        params = params.substring(0, params.length() - 1);
        return encryptSha256(params);
    }

    /**
     * 이니시스 사용 - 빌링결제를 위한 카드를 등록시 사용. (빌링결제는 카드를 등록 후 등록된 정보로 결제가 가능)
     *
     * @param list
     * @return
     */
    public static String encryptSha256OfSignatureOnlyValue(List<String> list) {
        StringBuilder sb = new StringBuilder();
        for (String val : list) {
            sb.append(String.format("%s", val));
        }
        String params = sb.toString();
        return encryptSha256(params);
    }

    /**
     * 짧은 URL 등을 생성할때 사용하기 위해 long 값을 Base62 값으로 생성하여 리턴
     *
     * @param value
     * @return
     */
    public static String generateLongToBase62(long value) {
        final StringBuilder sb = new StringBuilder();
        do {
            long i = value % 62;
            sb.append(BASE62[(int) i]);
            value /= 62;
        } while (value > 0);
        return sb.toString();
    }

    /**
     * 짧은 URL 값을 다시 long 값으로 변환
     *
     * @param base62Str
     * @return
     */
    public static long generateBase62ToLong(String base62Str) {
        long result = 0;
        long power = 1;

        for (int i = 0; i < base62Str.length(); i++) {
            int digit = new String(BASE62).indexOf(base62Str.charAt(i));
            result += digit * power;
            power *= 62;
        }
        return result;
    }
}