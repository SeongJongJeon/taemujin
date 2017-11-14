package com.taemujin.model.domain;

import com.taemujin.core.enumtype.DefaultEnum;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "chatRoom")
public class ChatRoom {
    @Id
    private long userId;

    private String userName;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DefaultEnum.UserType userType;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "datetime NOT NULL DEFAULT CURRENT_TIMESTAMP")
    private Date createdDate;
}