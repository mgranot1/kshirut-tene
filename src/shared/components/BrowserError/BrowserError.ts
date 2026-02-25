const BrowserError = () => {
  return `
    <style>
    .browser__error {
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      direction: rtl;
      animation: fadeIn 2s linear;
      overflow: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      font-family: "Heebo";
    }
    .browser__error .browser__error-message {
      font-weight: 500;
      font-size: 1rem;
    }
    .browser__error .browser__error-title {
      font-size: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .browser__error .browser__error-title span {
      animation: titleWave 2s ease-in-out infinite;
      -webkit-animation: titleWave 2s ease-in-out infinite;
      font-weight: bold;
    }
    .browser__error .browser__error-title span:nth-child(odd) {
      animation-delay: 1s;
      -webkit-animation-delay: 1s;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes titleWave {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(10px);
      }
      100% {
        transform: translateY(0x);
      }
    }/*# sourceMappingURL=BrowserError.css.map */
    </style>
      <div class="browser__error" role="status" aria-live="polite">
        <div class="browser__error-title">
          <span>ש</span>
          <span>ג</span>
          <span>י</span>
          <span>א</span>
          <span>ה</span>
        </div>
        <div class="browser__error-message">
          <span>
            לצערנו אנחנו לא תומכים בדפדפן זה :(
            <br /> אם הגעת לפה, נסה/י לפתוח את המערכת בכרום.
            <br /> אם הפתיחה בכרום לא מצליחה ומחזירה אותך לפה,
            <br /> נדרש לפנות למנהלי הרשת/מחשוב ביחידתך.
            <br /> לנוחיותם – מצורף פה קישור להנחיות הטיפול בבעיה במחשב.
            <br />
            <a
              href="https://portal.army.idf/sites/Mashov_Hoshen/NEHALIM/_layouts/15/DocIdRedir.aspx?ID=SSEUWP24VYP6-1099303498-611"
              target="_blank"
            >
              טיפול בבעיית הדפדפן
            </a>
            <br />
            <br /> נתראה, שח"ר
          </span>
        </div>
      </div>`;
};

export default BrowserError;
