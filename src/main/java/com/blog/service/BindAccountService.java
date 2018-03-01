package com.blog.service;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.blog.entity.BindAccount;

/**
 * @author ppm
 */
public interface BindAccountService {

	/**
	 * 保存账号绑定
	 * @param bindAccount
	 * @return
	 */
	boolean save(BindAccount bindAccount);

	/**
	 * 删除账号绑定
	 * @param bindAccount
	 * @return
	 */
	boolean delBind(BindAccount bindAccount);

	/**
	 *验证openId是否已经绑定
	 * @param openId
	 * @return
	 */
	boolean validOpenId(String openId);

	/**
	 *按openId查询绑定账号
	 * @param openId
	 * @return
	 */
	BindAccount findByOpenId(String openId);

	/**
	 * 两页验证用户名密码
	 * @param req
	 * @param res
	 */
	void login(HttpServletRequest req, HttpServletResponse res);

	/**
	 * 两页认证回调
	 * @param req
	 * @param resp
	 */
	boolean auth(HttpServletRequest req, HttpServletResponse resp,String openId);

	String getOpenId(String code);
}
