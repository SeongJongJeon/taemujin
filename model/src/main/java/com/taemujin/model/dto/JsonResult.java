package com.taemujin.model.dto;

import lombok.Data;

/**
 * Created by alex on 2016. 12. 29..
 */
@Data
public class JsonResult {
    private int code = 200;
    private String message = "SUCCESS";
    private Object resultObj;

    public JsonResult() {

    }

    public JsonResult(String message) {
        this.message = message;
    }

    public JsonResult(int code) {
        this.code = code;
    }

    public JsonResult(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public void fail() {
        this.code = 500;
        this.message = "FAIL";
    }

}
