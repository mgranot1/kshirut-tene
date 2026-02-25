export interface IContactDetails {
  firstTitle: string;
  secTitle?: string;
  matkalyPhone: string;
  ezrahiPhone: string;
  shluha: number;
  firstLinkText: string;
  firstLink: string;
  secLinkText?: string;
  secLink?: string;
  text?: string;
}

export const getContact = () => {
  const env = import.meta.env.VITE_APP_NETWORK;

  const contactDetails = {} as IContactDetails;

  if (env === "army") {
    contactDetails.firstTitle = "תמיכה בטלפון:";
    contactDetails.matkalyPhone = "0303-4888";
    contactDetails.ezrahiPhone = "03957-4888";
    contactDetails.shluha = 3;
    contactDetails.firstLinkText = "לפתיחת תקלה";
    contactDetails.firstLink = "https://support.army.idf/new-incident";
    contactDetails.secLinkText = "למדריך למשתמש";
    contactDetails.secLink =
      "https://portal.army.idf/sites/atal_tikshuv/7960544/y5f/z6g/30/Forms/AllItems.aspx#";
  } else {
    contactDetails.firstTitle = "תמיכה בטלפון:";
    contactDetails.matkalyPhone = "0303-4888";
    contactDetails.ezrahiPhone = "03957-4888";
    contactDetails.shluha = 3;
    contactDetails.secTitle = "לפתיחת פנייה וצפייה במדריך למשתמש";
    contactDetails.firstLink = "https://chat.idf.cts/direct/h0700mashlag2";
    contactDetails.firstLinkText = "לצ'אט";
    contactDetails.text = 'יש לפנות בצ\'אט המבצעי לקבוצה "תמיכה בבז"כ 3.0';
  }
  return contactDetails;
};
