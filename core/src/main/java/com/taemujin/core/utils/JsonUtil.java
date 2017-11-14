package com.taemujin.core.utils;

/**
 * Created by sv506 on 2016-10-12.
 */

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public class JsonUtil {
    private static final Logger logger = LoggerFactory.getLogger(JsonUtil.class);

    private static final ObjectMapper mapper;
    private static final ObjectMapper ignoreAnnotaionMapper;

    static {
        mapper = new ObjectMapper() {
            {
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            }
        };
        mapper.setVisibility(mapper.getSerializationConfig().getDefaultVisibilityChecker()
                .withFieldVisibility(JsonAutoDetect.Visibility.ANY)
                .withGetterVisibility(JsonAutoDetect.Visibility.NONE)
                .withSetterVisibility(JsonAutoDetect.Visibility.NONE)
                .withCreatorVisibility(JsonAutoDetect.Visibility.NONE)
        );

        ignoreAnnotaionMapper = new ObjectMapper() {
            {
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            }
        };
        ignoreAnnotaionMapper.configure(MapperFeature.USE_ANNOTATIONS, false);
        ignoreAnnotaionMapper.setVisibility(mapper.getSerializationConfig().getDefaultVisibilityChecker()
                .withFieldVisibility(JsonAutoDetect.Visibility.ANY)
                .withGetterVisibility(JsonAutoDetect.Visibility.NONE)
                .withSetterVisibility(JsonAutoDetect.Visibility.NONE)
                .withCreatorVisibility(JsonAutoDetect.Visibility.NONE)
        );
    }

	/*private static final ObjectMapper mongoMapper = new ObjectMapper() {
        {
			configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		}
	};*/

    /**
     * Domain 객체를 MongoDB Document로 생성한다.
     */
    /*public static <T> T generateDomainToDbObject(Object obj, TypeReference valueTypeRef) {
        return mongoMapper.convertValue(obj, valueTypeRef);
	}*/
    public static <T> T generateStringToJson(String jsonString, TypeReference valueTypeRef) {
        if (jsonString == null) {
            return null;
        }
        T object = null;
        try {
            object = mapper.readValue(jsonString, valueTypeRef);
        } catch (IOException e) {
            return null;
        }
        return object;
    }

    public static String generateClassToJson(Object obj) {
        if (obj == null) {
            return null;
        }
        String json = null;
        try {
            json = mapper.writeValueAsString(obj);
        } catch (IOException e) {
            logger.error("generateClassToJson json Exception error : " + e.getMessage() + ", toString : " + obj.toString());
            return null;
        }
        return json;
    }

    public static String generateClassToJsonOnIgnoreAnnotation(Object obj) {
        if (obj == null) {
            return null;
        }
        String json = null;
        try {
            json = ignoreAnnotaionMapper.writeValueAsString(obj);
        } catch (IOException e) {
            logger.error("generateClassToJson json Exception error : " + e.getMessage() + ", toString : " + obj.toString());
            return null;
        }
        return json;
    }

    public static byte[] generateClassToJsonByte(Object obj, String encoding) {
        byte[] bytes = new byte[0];

        try {
            String jsonString = mapper.writeValueAsString(obj);
            bytes = jsonString.getBytes(encoding);
        } catch (JsonProcessingException e) {
            logger.error("generateClassToJsonByte byte Exception error : " + e.getMessage() + ", toString : " + obj.toString());
        } catch (UnsupportedEncodingException e) {
            logger.error("generateClassToJsonByte byte Exception error : " + e.getMessage() + ", toString : " + obj.toString());
        }

        return bytes;
    }

    public static byte[] generateClassToJsonByteOnIgnoreAnnotation(Object obj, String encoding) {
        byte[] bytes = new byte[0];

        try {
            String jsonString = ignoreAnnotaionMapper.writeValueAsString(obj);
            bytes = jsonString.getBytes(encoding);
        } catch (JsonProcessingException e) {
            logger.error("generateClassToJsonByte byte Exception error : " + e.getMessage() + ", toString : " + obj.toString());
        } catch (UnsupportedEncodingException e) {
            logger.error("generateClassToJsonByte byte Exception error : " + e.getMessage() + ", toString : " + obj.toString());
        }

        return bytes;
    }

    public static <T> T generateJsonToClass(String jsonData, TypeReference valueTypeRef) {
        if (jsonData == null) {
            return null;
        }
        T object = null;
        try {
            object = mapper.readValue(jsonData, valueTypeRef);
        } catch (IOException e) {
            logger.error("Json Util Parsing Error : " + e.getMessage());
            return null;
        }
        return object;
    }

    public static <T> T generateJsonToClassOnIgnoreAnnotation(String jsonData, TypeReference valueTypeRef) {
        if (jsonData == null) {
            return null;
        }
        T object = null;
        try {
            object = ignoreAnnotaionMapper.readValue(jsonData, valueTypeRef);
        } catch (IOException e) {
            logger.error("Json Util Parsing Error : " + e.getMessage());
            return null;
        }
        return object;
    }
}
