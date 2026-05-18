type Props = {
  errorMessage: string;
};

export default function InputError({ errorMessage }: Props) {
  return <p className="text-red-500 text-sm">{errorMessage}</p>;
}
