package com.blog.controller.base;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by zyq on 2017/7/13.
 */
@Controller
@RequestMapping(value="/base")
public class HomeController {

    @RequestMapping(value="/home")
    public String view(HttpServletRequest request){
        // iCBFileService.getICBImageUrl("http://10.4.3.13:6888/dacx/temp/10.4.199.174/440003/00004413000000000000064001/2.tif ","test" ,"00004413000000000000064001", 2);
        return "/base/home";
    }
    @RequestMapping(value="/test")
    public String test(HttpServletRequest request){
        // iCBFileService.getICBImageUrl("http://10.4.3.13:6888/dacx/temp/10.4.199.174/440003/00004413000000000000064001/2.tif ","test" ,"00004413000000000000064001", 2);
        return "/base/print";
    }

    @RequestMapping(value="/index")
    public String index(HttpServletRequest request){

        return "/lover/index";
    }

}
