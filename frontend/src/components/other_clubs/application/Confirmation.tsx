import { CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ConfirmationProps = {
  onConfirm: () => void;
  className?: string;
};

const Confirmation:React.FC<ConfirmationProps> = ({ onConfirm, className }) => {
  return (
    <div className="flex mt-4 items-center justify-center">
      <Card className={cn("w-[380px]", className) }>
      <CardHeader>
        <CardTitle>Submission</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        Please check your details before proceeding.
      </CardContent>
      <CardFooter>
        <Button className="w-full mr-4" onClick={onConfirm}>
          <CheckIcon /> Yes, Submit
        </Button>
        <Button className="w-full" onClick={() =>{}}>
           No, Go Back
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
};

export default Confirmation;