package com.blog.service.impl;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.blog.service.EhCacheService;


@Service
public class EhCacheServiceImpl implements EhCacheService {
	
	@Cacheable(value="cache",key="#param")
	public String getTimestamp(String param) {
		System.out.println("-------进入------------");
		Long timestamp = System.currentTimeMillis();
		return timestamp.toString();
	}

}
