package com.taemujin.model.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration
@ComponentScan({"com.taemujin"})
@PropertySource(value = {"classpath:core.properties", "classpath:model.properties"})
@EnableJpaRepositories(basePackages = {"com.taemujin.model.repository"})
@MapperScan(annotationClass = Repository.class, basePackages = {"com.taemujin.model.dao"}, sqlSessionFactoryRef = "sqlSessionFactory")
@EnableTransactionManagement
public class ModelConfig {
    @Autowired
    private Environment environment;

    /**
     * Hibernate에서 발생하는 예외를 Spring에서 지원하는 DataAccessException으로 변환하기 위한 설정
     *
     * @return
     */
    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    private void setCommonDataSource(ComboPooledDataSource dataSource) throws Exception {
        dataSource.setDriverClass(environment.getRequiredProperty("mysql.jdbc.driver"));

        dataSource.setAcquireIncrement(Integer.valueOf(environment.getRequiredProperty("mysql.acquireIncrement")));
        dataSource.setMaxStatements(Integer.valueOf(environment.getRequiredProperty("mysql.maxStatements")));
        dataSource.setAcquireRetryAttempts(Integer.valueOf(environment.getRequiredProperty("mysql.acquireRetryAttempts")));
        dataSource.setMaxIdleTime(Integer.valueOf(environment.getRequiredProperty("mysql.maxIdleTime")));
        dataSource.setMaxConnectionAge(Integer.valueOf(environment.getRequiredProperty("mysql.maxConnectionAge")));
        dataSource.setCheckoutTimeout(Integer.valueOf(environment.getRequiredProperty("mysql.checkoutTimeout")));
        dataSource.setIdleConnectionTestPeriod(Integer.valueOf(environment.getRequiredProperty("mysql.idleConnectionTestPeriod")));
        dataSource.setTestConnectionOnCheckout(Boolean.valueOf(environment.getRequiredProperty("mysql.testConnectionOnCheckout")));
        dataSource.setPreferredTestQuery(environment.getRequiredProperty("mysql.preferredTestQuery"));
        dataSource.setTestConnectionOnCheckin(Boolean.valueOf(environment.getRequiredProperty("mysql.testConnectionOnCheckin")));
    }

    /**
     * Master DB 인스턴스 설정
     *
     * @return
     * @throws Exception
     */
    @Primary
    @Bean(destroyMethod = "close")
    public DataSource masterDataSource() throws Exception {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setJdbcUrl(environment.getRequiredProperty("mysql.master.url"));
        dataSource.setUser(environment.getRequiredProperty("mysql.master.user"));
        dataSource.setPassword(environment.getRequiredProperty("mysql.master.pwd"));
        dataSource.setMinPoolSize(Integer.valueOf(environment.getRequiredProperty("mysql.master.minPoolSize")));
        dataSource.setMaxPoolSize(Integer.valueOf(environment.getRequiredProperty("mysql.master.maxPoolSize")));
        setCommonDataSource(dataSource);

        return dataSource;
    }

    /**
     * Slave DB 인스턴스 생성
     *
     * @return
     * @throws Exception
     */
    @Bean(destroyMethod = "close")
    public DataSource slaveDataSource() throws Exception {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setJdbcUrl(environment.getRequiredProperty("mysql.slave.url"));
        dataSource.setUser(environment.getRequiredProperty("mysql.slave.user"));
        dataSource.setPassword(environment.getRequiredProperty("mysql.slave.pwd"));
        dataSource.setMinPoolSize(Integer.valueOf(environment.getRequiredProperty("mysql.slave.minPoolSize")));
        dataSource.setMaxPoolSize(Integer.valueOf(environment.getRequiredProperty("mysql.slave.maxPoolSize")));
        setCommonDataSource(dataSource);

        return dataSource;
    }

    /**
     * Route를 위한 Datasource 설정
     *
     * @param masterDataSource
     * @param slaveDataSource
     * @return
     */
    @Bean
    public DataSource routingDataSource(@Qualifier("masterDataSource") DataSource masterDataSource, @Qualifier("slaveDataSource") DataSource slaveDataSource) {
        ReplicationRoutingDataSource routingDataSource = new ReplicationRoutingDataSource();

        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put("write", masterDataSource);
        dataSourceMap.put("read", slaveDataSource);
        routingDataSource.setTargetDataSources(dataSourceMap);
        routingDataSource.setDefaultTargetDataSource(masterDataSource);

        return routingDataSource;
    }

    /**
     * Datasource 설정 (해당 데이터 소스는 Route 설정에 의해 컨넥션을 Master 또는 Slave에서 리턴)
     *
     * @param routingDataSource
     * @return
     */
    @Bean
    public DataSource dataSource(@Qualifier("routingDataSource") DataSource routingDataSource) {
        return new LazyConnectionDataSourceProxy(routingDataSource);
    }

    /**
     * 1. MyBatis 설정
     *
     * @param dataSource
     * @return
     * @throws Exception
     */
    @Bean
    public SqlSessionFactory sqlSessionFactory(@Qualifier("dataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
        sessionFactoryBean.setDataSource(dataSource);
        sessionFactoryBean.setTypeAliasesPackage("com.taemujin.model.dto");
        sessionFactoryBean.setConfigLocation(new PathMatchingResourcePatternResolver().getResources("classpath:com/taemujin/model/mybatis/mybatis-config.xml")[0]);
        sessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:com/taemujin/model/mybatis/mapper/**/*.xml"));
        return sessionFactoryBean.getObject();
    }

    /**
     * 2. MyBatis 설정
     *
     * @param sqlSessionFactory
     * @return
     */
    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

    /**
     * 트랜잭션 관리자 설정
     *
     * @param emf
     * @return
     */
    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(emf);
        return transactionManager;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(@Qualifier("dataSource") DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("com.taemujin.model.domain");

        Properties properties = new Properties();
//        properties.setProperty("hibernate.hbm2ddl.auto", "create-drop");
        properties.setProperty("hibernate.dialect", environment.getProperty("hibernate.dialect"));
//        properties.setProperty("hibernate.show_sql", "prod".equals(environment.getProperty("env")) ? "false" : "true");
        properties.setProperty("hibernate.show_sql", "false");
        //create : 기존 테이블 삭제후 생성
        //create-drop : create 와 같으나 종료시 테이블 삭제
        //update : 변경분만 반영(운영 DB에는 사용하지 말것!!!)
        //validate : 엔티티와 테이블이 정상 매핑되었는지만 확인
        //none : 사용안함
        switch (environment.getRequiredProperty("env")) {
            case "prod":
            case "dev":
                properties.setProperty("hibernate.hbm2ddl.auto", "validate");
                break;
            case "local":
//                properties.setProperty("hibernate.hbm2ddl.auto", "validate");
                properties.setProperty("hibernate.hbm2ddl.auto", "create");
                break;
        }

        JpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(jpaVendorAdapter);
        em.setJpaProperties(properties);
        return em;
    }
}