import { Dispatch, SetStateAction, useEffect } from "react";
import "./Contact.scss";
import { getContact } from "./getContact.util";

interface IContactProps {
  opened: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Contact: React.FC<IContactProps> = ({ opened, setOpen }) => {
  const contactDetails = getContact();

  useEffect(() => {
    const handleClick = () => {
      if (opened) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClick);

    return () => {
      document.removeEventListener("pointerdown", handleClick);
    };
  }, []);

  return (
    <>
      {opened && (
        <div className="contact-box" onPointerDown={(e) => e.stopPropagation()}>
          <p className="contact-box__title">{contactDetails.firstTitle}</p>
          <p className="contact-box__text">{`ממטכ\"לי: ${contactDetails.matkalyPhone}`}</p>
          <p className="contact-box__text">{`מאזרחי: ${contactDetails.ezrahiPhone}`}</p>
          <p className="contact-box__text">{`שלוחה ${contactDetails.shluha}`}</p>
          <p className="contact-box__title">{contactDetails.secTitle}</p>
          <p className="contact-box__text">{contactDetails.text}</p>

          <>
            <a
              href={contactDetails.firstLink}
              target="_blank"
              className="contact-box__link"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {contactDetails.firstLinkText}
            </a>

            <a
              href={contactDetails.secLink}
              target="_blank"
              className="contact-box__link"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {contactDetails.secLinkText}
            </a>
          </>
        </div>
      )}
    </>
  );
};

export default Contact;
