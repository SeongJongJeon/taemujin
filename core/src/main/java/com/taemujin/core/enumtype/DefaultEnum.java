package com.taemujin.core.enumtype;

public class DefaultEnum {
    public enum YesOrNo {
        Y, N
    }

    public enum UserType {
        GENERAL,
        ADMIN
    }

    //JPA를 Enum 타입으로 하는 경우 데이터 저장시 value 값을 셋팅할 수 없음.
    public enum NumberType {
        ONE(1),
        TWO(2);

        private int value;

        NumberType(int value) {
            this.value = value;
        }
    }
}
