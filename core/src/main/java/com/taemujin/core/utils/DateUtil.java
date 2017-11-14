package com.taemujin.core.utils;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created by alex on 2017. 1. 31..
 * <p>
 * LocalDate : [년,월,일]과 같은 날짜만 표현하는 클래스 (시간은 포함하지 않는다)
 * LocalTime : [시,분,초]와 같이 시간만 표현하는 클래스
 * LocalDateTime : [년,월,일,시,분,초]를 표현하는 클래스
 */
public class DateUtil {
    /**
     * 현재 날짜로부터 입력받은 달을 더하고 시분초는 입력받은 값으로 셋팅
     *
     * @param addMonths
     * @param hour
     * @param minute
     * @param second
     * @return
     */
    public static Date generateDateByMonthHourMinuteSecond(int addMonths, int hour, int minute, int second) {
        LocalDateTime dateTime = LocalDateTime.now().plusMonths(addMonths)
                .withHour(hour)
                .withMinute(minute)
                .withSecond(second)
                .withNano(0);
        return Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 입력받은 날짜의 시분초 값을 셋팅
     *
     * @param date
     * @param hour   24시기준
     * @param minute
     * @param second
     * @return
     */
    public static Date generateTimeInDate(Date date, int hour, int minute, int second) {
        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, minute);
        cal.set(Calendar.SECOND, second);
        cal.set(Calendar.MILLISECOND, 0);

        return cal.getTime();
    }

    /**
     * 현재 날짜로부터 이전 또는 이후 일자로 셋팅
     *
     * @param days
     * @return
     */
    public static Date generateMinusOrPlusDays(int days, int hour, int minute, int second, boolean isMinus) {
        LocalDateTime dateTime;
        if (isMinus) {
            dateTime = LocalDateTime.now().minusDays(days);
        } else {
            dateTime = LocalDateTime.now().plusDays(days);
        }
        dateTime.withHour(hour)
                .withMinute(minute)
                .withSecond(second)
                .withNano(0);
        return Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 현재 시간으로부터 이전 또는 이후 시간을 셋팅
     *
     * @param hours
     * @return
     */
    public static Date getMinusOrPlusHours(long hours, boolean isMinus) {
        LocalDateTime dateTime = LocalDateTime.now();
        if (isMinus) {
            dateTime.minusHours(hours);
        } else {
            dateTime.plusHours(hours);
        }

        return Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 현재 시간으로부터 이전 또는 이후 분을 셋팅
     *
     * @param minutes
     * @return
     */
    public static Date getMinusOrPlusMinutess(long minutes, boolean isMinus) {
        LocalDateTime dateTime = LocalDateTime.now();
        if (isMinus) {
            dateTime.minusMinutes(minutes);
        } else {
            dateTime.plusMinutes(minutes);
        }

        return Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 현재 시간으로부터 이전 또는 이후 초를 셋팅
     *
     * @param seconds
     * @return
     */
    public static Date generateMinusOrPlusSeconds(int seconds, boolean isMinus) {
        LocalDateTime dateTime = LocalDateTime.now();
        if (isMinus) {
            dateTime.minusSeconds(seconds);
        } else {
            dateTime.plusSeconds(seconds);
        }

        return Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 주어진 포맷으로 날짜를 변환
     *
     * @param format ex) yyyy-MM-dd HH:mm:ss
     * @return
     */
    public static String generateDateToStringByFormat(Date date, String format) {
        SimpleDateFormat sf = new SimpleDateFormat(format);
        return sf.format(date);
    }
}