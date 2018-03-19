package com.tool;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class SpringUtil {

    private static ApplicationContext applicationContext;
    static {
        applicationContext = new ClassPathXmlApplicationContext("classpath:/applicationContext.xml");
    }

    private SpringUtil() {
    }

    public static ApplicationContext GetApplicationContext() {
        return applicationContext;
    }
}
