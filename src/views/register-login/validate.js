/**
 * 校验姓名, 校验成功返回true, 校验失败返回字符串、vee-validate会将字符串显示出来
 * @param {*} value
 */
export const validateName = (value) => {
  if (value === void 0 || value.length <= 0) return '用户名不能为空'
  if (value.length < 3 || value.length > 12) return '用户名只能为3-12位'
  return true
}

/**
 * 校验密码
 * @param {*} value
 * @returns
 */
export const validatePassword = (value) => {
  if (value === void 0 || value.length <= 0) return '密码不能为空'
  if (value.length < 6 || value.length > 12) return '密码只能为6-12位'
  return true
}
