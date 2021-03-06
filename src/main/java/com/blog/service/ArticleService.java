package com.blog.service;

import com.blog.entity.Article;

import java.util.List;

public interface ArticleService {

    //获取所有列表
    List<Article> getAllList();

    //获取某用户列表
    List<Article> getList(String userId);

}
