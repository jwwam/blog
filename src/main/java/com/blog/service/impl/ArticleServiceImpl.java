package com.blog.service.impl;

import com.blog.dao.ArticleDao;
import com.blog.entity.Article;
import com.blog.service.ArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service("articleService")
@Transactional
public class ArticleServiceImpl implements ArticleService {

    @Resource
    ArticleDao articleDao;

    public List<Article> getAllList() {
        return articleDao.findAll();
    }

    public List<Article> getList(String userId) {
        return articleDao.findByUserId(userId);
    }


}
