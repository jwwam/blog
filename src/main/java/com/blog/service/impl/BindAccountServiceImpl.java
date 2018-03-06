package com.blog.service.impl;

import java.io.IOException;
import java.net.URL;
import java.util.UUID;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.blog.utils.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blog.dao.BindAccountDao;
import com.blog.entity.BindAccount;
import com.blog.service.BindAccountService;
import com.blog.utils.CommonData;

import cn.gov.zh.QueryTicketInfoNewRequest;
import cn.gov.zh.QueryTicketInfoNewResponse;
import cn.gov.zh.UaWebServiceSoap;
import cn.gov.zh.Unit;
import cn.hengqin.utils.ConfigData;
import cn.hengqin.utils.CryptString;
import cn.hengqin.utils.CryptUtil;
import cn.hengqin.utils.TimeUtil;

/**
 * Created by ppm on 2017/7/21.
 */
@Transactional
@Component
@EnableScheduling
public class BindAccountServiceImpl implements BindAccountService {
	@Value("#{configProperties['hq.visitPath']}")
	public String visitPath;
	@Value("#{configProperties['hq.zhAuthPath']}")
	public String zhAuthPath;
	@Value("#{configProperties['hq.srcSsDeviceNo']}")
	public String srcSsDeviceNo;
	@Value("#{configProperties['hq.key']}")
	public String key;
	@Value("#{configProperties['hq.destValue']}")
	public String destValue;

	@Value("#{configProperties['hq.vchat.appid']}")
	public  String appid;
	@Value("#{configProperties['hq.vchat.appSecret']}")
	public  String secret;
	public static String rediretReturn;
	public static String loginreturnUrl;
	public static String ticketUrl;
	public static String logoutredirtReturn;
	
	
     @Resource
     BindAccountDao dao;
    public boolean save(BindAccount bindAccount) {
        bindAccount.setId(UUID.randomUUID().toString());
        BindAccount bindAccount1=dao.save(bindAccount);
        if(bindAccount1!=null){
            return  true;
        }
        return false;
    }

	public boolean delBind(BindAccount bindAccount) {
		dao.delete(bindAccount);
		return false;
	}

	public boolean validOpenId(String openId) {
		if(StringUtils.isEmpty(openId)){
			return false;
		}
		BindAccount bindAccount=dao.findByOpenId(openId);
		if(bindAccount!=null){
			return  true;
		}
		return false;
	}

	public BindAccount findByOpenId(String openId) {
		BindAccount bindAccount=dao.findByOpenId(openId);
		return bindAccount;
	}


	public void init(){
    	System.out.println("data init");
    	 try {
             System.out.println(zhAuthPath);
             rediretReturn = zhAuthPath + "ZhuaPortal/TokenAuth?TokenAuthRequest=";
             ticketUrl = zhAuthPath + "UaCommonService2.0/uaService?WSDL";
             logoutredirtReturn = zhAuthPath + "ZhuaPortal/Logout?LogoutRequest=";
             loginreturnUrl = visitPath + "bindAccount/auth";
             
             ConfigData.setSrcSsDeviceNo(srcSsDeviceNo);
             ConfigData.setKey(key); 
             ConfigData.setDestValue(destValue);
             ConfigData.setPassportLogin("");
             ConfigData.setPassportLogout("");
         } catch (Exception e) {
        	 e.printStackTrace();
         }
    }
    
    public void login(HttpServletRequest req, HttpServletResponse res){
    	init();
        try {
        	//用户没有登录，获取访问重定向接口的地址
        	String rederectUrl = rediretReturn; //获取统一认证平台的重定向令牌检查接口地址
        	String returnUrl = loginreturnUrl;
        	String requestValue = CommonData.getudb3Des(returnUrl);     //获取统一认证平台的重定向请求串
        	rederectUrl = rederectUrl + requestValue;
        	System.out.println("登录地址："+rederectUrl);
			res.sendRedirect(rederectUrl);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
    }
	
    public boolean auth(HttpServletRequest req, HttpServletResponse resp,String openId){
    	System.out.println("TokenAuthResponse");
    	// 完成的主要功能是得到重定向认证接口返回的请求。解析出ticketId然后调用查询接口。查询到用户信息。展示在界面上。
		String key = ConfigData.getKey();
		String destValue = ConfigData.getDestValue();
		String passportLoginResponse = req.getParameter("TokenAuthResponse");// 得到返回的return值
		//System.out.println("获取信息TokenAuthResponse："+passportLoginResponse);//部署时注释

		QueryTicketInfoNewResponse response = null;
	//	String resultCode = "";
		if (passportLoginResponse != null && !"".equals(passportLoginResponse)) {
			try {
				String[] src = passportLoginResponse.split("\\$");
				String deCryptString = CryptString.getDecryptString(src[1], destValue, key);
				String[] deCryptArray = deCryptString.split("\\$");
				String ticket = "";
				for (int i = 0; i < deCryptArray.length - 1; i++) {
				/*	if (i == 0) {
						resultCode = deCryptArray[i];
					}*/
					if (i == 1) {
						ticket = deCryptArray[i]; // 获取返回的ticket值
					}
				}
				//根据ticket值调用接口获取ticket信息。
				System.out.println("ticketUrl："+ticketUrl);
				cn.gov.zh.UaService service = new cn.gov.zh.UaService(new URL(ticketUrl));
				QueryTicketInfoNewRequest request = new QueryTicketInfoNewRequest();
				request.setClientId(ConfigData.getSrcSsDeviceNo());
				request.setTicket(ticket);
				String time = TimeUtil.getNowTime();
				request.setTimeStamp(time);
				String str = request.getClientId() + request.getTicket() + request.getTimeStamp();
				String sign = CryptUtil.udb3DesCrypt(str, key, destValue);
				//System.out.println("获取信息sign："+sign);//部署时注释
				//System.out.println("获取信息getClientId："+request.getClientId());//部署时注释
				//System.out.println("获取信息getSign："+request.getSign());//部署时注释
				//System.out.println("获取信息getTicket："+request.getTicket());//部署时注释
				//System.out.println("获取信息getTimeStamp："+request.getTimeStamp());//部署时注释

				request.setSign(sign);
				UaWebServiceSoap udbCommonService = service.getUaWebServiceSoap();
				response = udbCommonService.queryTicketInfoNew(request);
				Unit unit = response.getUnit();
				if (null != unit && (null != unit.getUserName())) {
					String account = response.getUserAccount();
					String idCardNumber = unit.getAgreeNo();
					String idCardType = unit.getAgreeId();
					if( idCardNumber == null ){
						System.out.println("统一认证证件号为空 "+idCardNumber);
						System.out.println("从统一认证系统获取信息失败 ");
						return false;
					}
					System.out.println("登录账户：" + account);
					System.out.println("证件号：" + idCardNumber);
					System.out.println("证件号类型：" + idCardType);
					BindAccount bindAccount=new BindAccount();
					if(!validOpenId(openId)){
						bindAccount.setAccount(account);
						bindAccount.setCompanyName(unit.getCompanyName());
						bindAccount.setIdCardNumber(idCardNumber);
						bindAccount.setOpenId(openId);
						save(bindAccount);
					}
					//
					
				}
			} catch (Exception ex) {
				System.out.println("从统一认证系统获取信息失败 ");
			}
		}
		System.out.println("从统一认证系统获取信息成功 ");
		return true;

	}

	public String getOpenId(String code) {
		return null;
	}

}
