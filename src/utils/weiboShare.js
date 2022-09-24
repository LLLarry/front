import { WEI_BO_APP_KEY, WEI_BO_UID } from '@/constants'
/**
 *微博分享
 * @param{*]imgUrl分享的图片URL* param {*]}path 网页链接
 */
export default (imgUrl, path) => {
  window.open(
    `https://service.weibo.com/share/share.php?url=${path}&title=这章图片不错，给大家分享看下&pic=${imgUrl}&appKey=${WEI_BO_APP_KEY}ralateUid=${WEI_BO_UID}`,
    '_blank '
  )
}
