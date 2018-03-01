package com.blog.controller.gongzhonghao;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.blog.entity.BindAccount;
import com.blog.service.BindAccountService;
import com.blog.utils.StateParameter;
import com.blog.utils.StringUtils;
import com.blog.utils.vchat.GetVChatInfoUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.blog.controller.base.BaseController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 绑定账号
 */
@Controller
@RequestMapping(value="/bindAccount")
public class BindAccountController extends BaseController{
    @Resource
    BindAccountService bindAccountService;


    @RequestMapping(value="/view")
    public String view(HttpServletRequest request){
        GetVChatInfoUtil chatInfoUtil=new GetVChatInfoUtil();
        chatInfoUtil.getOpenId();
        return "/gongzhonghao/bindAccount";
    }

    @RequestMapping(value="/bind")
    public String getCode(HttpServletRequest request,String code){
        String openIdExtis=(String)request.getSession().getAttribute("openId");
        String openId="";
        if(StringUtils.isNotEmpty(openIdExtis)){
            openId=openIdExtis;
        }else {
            openId =bindAccountService.getOpenId(code);
        }
        System.out.println("bind 的 openId:" + openId);
        if(StringUtils.isNotEmpty(openId)){
            System.out.println("bind 的 验证:"+bindAccountService.validOpenId(openId));
            BindAccount bindAccount=bindAccountService.findByOpenId(openId);
            if(bindAccount==null){
                request.getSession().setAttribute("openId",openId);
                return "redirect:login";
            }else {
                request.setAttribute("msg","尊敬的"+bindAccount.getCompanyName()+",您已经绑定成功");
                request.setAttribute("openId", openId);
            }
        }else{
            request.setAttribute("msg","您绑定失败，请联系管理员");
        }

        return "/gongzhonghao/bindAccount";
    }

    @RequestMapping(value="/delBindview")
    public String delBindview(HttpServletRequest request){
        String flag = request.getParameter("flag");
        if(flag.equals("1")){
            request.setAttribute("code", 1);
            request.setAttribute("msg", "您已经解除绑定");
        }else{
            request.setAttribute("code", 0);
            request.setAttribute("msg", "解绑失败,请联系管理员");
        }
        return "/gongzhonghao/delbind";
    }

    @RequestMapping(value="/delBind",method = RequestMethod.GET)
    @ResponseBody
    public ModelMap delBind(String code){
        ModelMap map = new ModelMap();
        System.out.println("code:" + code);
        BindAccount bindAccount = bindAccountService.findByOpenId(code);
        if(bindAccount!=null){
            bindAccountService.delBind(bindAccount);
            map.addAttribute("code", 1);
        }else{
            map.addAttribute("code", 0);
        }
        return map;
    }

    @RequestMapping(value="/getOpenId")
    public String getOpenId(HttpServletRequest request,String code){
        String openId =bindAccountService.getOpenId(code);
        return "";
    }

    @RequestMapping(value="/save",method = RequestMethod.POST)
    @ResponseBody
    public ModelMap bind(BindAccount bindAccount){
        ModelMap map=new ModelMap();
        try {
            boolean flg= bindAccountService.save(bindAccount);
            if(flg){
                map= this.getModelMap(StateParameter.SUCCESS, null, "绑定成功");
            }
        }catch (Exception e){
            map= this.getModelMap(StateParameter.FAULT, null, "绑定失败");
        }
        return  map;
    }

    @RequestMapping(value="/login")
    public void login(HttpServletRequest req, HttpServletResponse res){
        String openId=req.getSession().getAttribute("openId").toString();
        System.out.println("login 的openId:"+openId);
        bindAccountService.login(req, res);
    }

    @RequestMapping(value="/auth")
    public String auth(HttpServletRequest req, HttpServletResponse resp){
        try {
            String openId=(String)req.getSession().getAttribute("openId");
            System.out.println("openId:"+openId);
            boolean flg=bindAccountService.auth(req, resp,openId);
            if(flg){
                BindAccount bindAccount=bindAccountService.findByOpenId(openId);
                req.setAttribute("msg","尊敬的"+bindAccount.getCompanyName()+",您已经绑定成功");
            }else{
                req.setAttribute("msg","绑定失败");
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return "/gongzhonghao/bindAccount";
    }
}
