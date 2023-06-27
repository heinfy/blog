import React from 'react';
export default function FooterCopyright({copyright}) {
  return (
    <div
      className="footer__copyright"
    >
      <div>{ copyright }</div>
      <a href="https://beian.miit.gov.cn/" target="_blank" className="footer__link-item">京ICP备18036516号-4</a>
    </div>
  );
}
