'use client'

import TitleText from "@/components/TitleText";
import { useState } from "react";
import { useI18n } from "@/config/i18n/i18nProvider";
import { PortableTextBlock } from "@portabletext/types";
import AnimateOnView from "@/components/AnimateOnView";

type ContactUs = {
  title: PortableTextBlock;
  description: string;
  backgroundColor: { value: string };
};

export default function ContactUs(section: ContactUs) {
  const color = section.backgroundColor?.value || '#B70100';  
  const newColorString = (color || '#B70100').slice(0, 7);

  const [values, setValues] = useState({
    name: "",
    compania: "",
    correo: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [contactMessage, setContactMessage] = useState("Correo sin enviar");
  const [isVisible, setIsVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    let errs: { [key: string]: string } = {};
    if (!values.name.trim()) errs.name = "Este campo es requerido";
    if (!values.correo.trim()) errs.correo = "Este campo es requerido";
    if (!values.subject.trim()) errs.subject = "Este campo es requerido";
    if (values.correo && !emailRegex.test(values.correo)) {
      errs.correo = "Correo inválido";
    }
    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prevErrors => {
      if (prevErrors[name]) {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      }
      return { ...prevErrors };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Mostrar toast enviando
      setContactMessage("Enviando mensaje...");
      setIsVisible(true);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();

        if (data.success) {
          setContactMessage("Tu mensaje ha sido enviado exitosamente.");
          setValues({ name: "", compania: "", correo: "", subject: "", message: "" });
        } else {
          setContactMessage("Ha ocurrido un error al enviar tu mensaje. Intenta de nuevo.");
        }
      } catch {
        setContactMessage("Ha ocurrido un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.");
      }

      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
    
  }

  const {dict} = useI18n();

  return (
    <section style={{ backgroundColor: newColorString }}>
      <div className="container p-lat min-h-screen relative">
        <div className="extra-layout-top" style={{ backgroundColor: newColorString }}></div>
        <div className="row justify-center relative z-8 pb-pink pt-green">
          <AnimateOnView  className="w-full lg:w-7/12">
            <h2 className="h1 text-center relative animate">
              <TitleText text={section.title} />
            </h2>
            {section.description && (
              <p className="uppercase pt-red text-center animate delay-sm">{section.description}</p>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-blue animate delay-sm-2">
              <div className="input-container relative">
                <input
                  autoComplete="off"
                  name="name"
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  className="h-24 rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.name}
                />
                {errors.name && <div className="mt-4 uppercase">{errors.name}</div>}
              </div>
              <div className="input-container">
                <input
                  autoComplete="off"
                  type="text"
                  name="compania"
                  id="compania"
                  value={values.compania}
                  onChange={handleChange}
                  className="h-24 rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.company}
                />
              </div>
              <div className="input-container">
                <input
                  autoComplete="off"
                  type="text"
                  name="correo"
                  id="correo"
                  value={values.correo}
                  onChange={handleChange}
                  className="h-24 rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.email}
                />
                {errors.correo && <div className="mt-4 uppercase">{errors.correo}</div>}
              </div>
              <div className="input-container">
                <input
                  autoComplete="off"
                  type="text"
                  name="subject"
                  id="subject"
                  value={values.subject}
                  onChange={handleChange}
                  className="h-24 rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.subject}
                />
                {errors.subject && <div className="mt-4 uppercase">{errors.subject}</div>}
              </div>
              <div className="text-container md:col-span-2">
                <textarea
                  name="message"
                  id="message"
                  value={values.message}
                  onChange={handleChange}
                  className="h-[268px] rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.message}
                ></textarea>
              </div>
              <div className="md:col-span-2 flex justify-center pt-4 md:pt-8">
                <button
                  type="submit"
                  className={`bg-offwhite py-[8px] px-6 lg:px-8 lg:py-4 flex gap-4 items-center rounded-[5px] lg:rounded-[10px] cursor-pointer btn-hover ${
                    (errors && Object.keys(errors).length > 0) ? 'disabled' : ''} ${(isVisible ? 'disabled' : '')}`}
                  disabled={(errors && Object.keys(errors).length > 0)}
                >
                  <span className="dot" style={{ backgroundColor: newColorString }}></span>
                  <p className="uppercase" style={{ color: newColorString }}>{ dict.general.contact.send }</p>
                </button>
              </div>
            </form>
          </AnimateOnView>
        </div>

        {contactMessage && (
          <div className={`fixed bottom-8 left-4 right-4 md:bottom-12 md:left-12 md:w-6/12 lg:w-4/12 z-100 bg-gray p-8 md:p-12 backdrop-blur-[15px] rounded-[15px] transition-opacity duration-500 ${isVisible ? '' : 'opacity-0'}`}>
            <p className="uppercase text-center md:text-start">{contactMessage}</p>
          </div>
        )}

        <div className="extra-layout" style={{ backgroundColor: newColorString }}></div>
      </div>
    </section>
  );
}
