package com.taemujin.model.config;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * Created by sv506 on 2016-10-11.
 */
@Slf4j
public class ReplicationRoutingDataSource extends AbstractRoutingDataSource {
    private static final Logger logger = LoggerFactory.getLogger(ReplicationRoutingDataSource.class);

    @Override
    protected Object determineCurrentLookupKey() {
        String dataSourceType = TransactionSynchronizationManager.isCurrentTransactionReadOnly() ? "read" : "write";
        return dataSourceType;
    }
}
