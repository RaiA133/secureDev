import './App.css';
import {
  Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input,
  Accordion, AccordionItem, CheckboxGroup, Checkbox
} from "@nextui-org/react";
import FileStructure from './components/FileStructure';

function App() {

  return (
    <div className='flex flex-row gap-4'>

      <Card className="max-w-[600px] max-h-[350px] p-5">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="/vite.svg"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">SecureDev</p>
            <p className="text-small text-default-500">securedev.org</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className='justify-center'>
          <p className='mb-2 text-center'>Open your local project</p>
          <Input type="file" multiple />
        </CardBody>
        <Divider />
        <CardFooter>
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/raia133"
          >
            About Me
          </Link>
        </CardFooter>
      </Card>

      <FileStructure />

    </div>
  );
}

export default App;
