import { useCallback } from "react";
import Button from "./Button";



interface FormProps{
  title:string,
  body?: React.ReactElement;
  footer?: React.ReactElement;
  onSubmit: () => void;
  actionlabel: string;
  disabled?: boolean;
  
}
const FormPage:React.FC<FormProps> = ({
  title,
  body,
  footer,
  onSubmit,
  actionlabel,
  disabled,
}) => {
  const handleSubmit = useCallback(()=>{
    if(disabled){
      return;
    }
    onSubmit();
  },[onSubmit,disabled])
  return (
    <div className='justify-center 
          items-center 
          flex 
          outline-none 
          focus:outline-none
         '>
      <div className='relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto border border-slate-600 rounded-lg'>
      <div 
          className={`
            translate
            duration-300
            h-full
            translate-y-0
            opacity-100
          `}>
            <div className="
              translate
              h-full
              lg:h-auto
              md:h-auto
              border-0 
              rounded-lg 
              shadow-lg 
              relative 
              flex 
              flex-col 
              w-full 
              bg-white 
              outline-none 
              focus:outline-none
            "
            >
              {/*header*/}
              <div className="
                flex 
                items-center 
                p-6
                rounded-t
                justify-center
                relative
                border-b-[1px]
                "
              >
                <div className="text-lg font-semibold">
                  {title}
                </div>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                {body}
              </div>
              {/*footer*/}
              <div className="flex flex-col gap-2 p-6">
                <div 
                  className="
                    flex 
                    flex-row 
                    items-center 
                    gap-4 
                    w-full
                  "
                >
                  
                  <Button 
                    disabled={disabled} 
                    label={actionlabel} 
                    onClick={handleSubmit}
                  />
                </div>
                {footer}
              </div>
            </div>
          </div> 
      </div>
    </div>
  )
}


export default FormPage;