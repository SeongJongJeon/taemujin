package com.taemujin.model;

import com.taemujin.model.config.ModelConfig;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Created by alex on 2016. 11. 18..
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ModelConfig.class})
@Transactional(transactionManager = "transactionManager")
@ActiveProfiles(profiles = "test")
@Ignore
public class TestParent {
    @PersistenceContext
    public EntityManager em;
}
