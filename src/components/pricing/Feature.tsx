import { CheckIcon } from "@radix-ui/react-icons";

interface FeatureProps {
  text: string;
}

export default function Feature({ text }: FeatureProps) {
  return (
    <li className="flex items-start">
      <CheckIcon className="h-6 w-6 flex-shrink-0 text-green-500" />
      <p className="ml-3 text-gray-700 dark:text-gray-300">{text}</p>
    </li>
  );
}
