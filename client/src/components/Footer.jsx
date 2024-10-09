import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
import { FaLeaf } from "react-icons/fa";

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 '>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
          <Link
        to="/"
        className="self-center text-sm sm:text-xl font-semibold dark:text-white"
      >
        <div className="text-2xl flex items-center gap-2 font-bold font-averia uppercase">
          <p className="text-primary">Plant</p>
          <p className="text-secondary">Store</p>
          <FaLeaf className="text-green-500" />
        </div>
      </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6 '>
            <div>
              <Footer.Title title='Giới Thiệu' />
              <Footer.LinkGroup col>
               
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                   SEP490_FALL24_OPMS 

                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Theo giõi' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.github.com/sahandghavidel'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link href='#'>Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Thành Viên' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>TinNV</Footer.Link>
                <Footer.Link href='#'>ThuanNPN</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="Project Blog Team 7"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='#' icon={BsFacebook}/>
            <Footer.Icon href='#' icon={BsInstagram}/>
            <Footer.Icon href='#' icon={BsTwitter}/>
            <Footer.Icon href='https://github.com/NgocNhan43/Project_WDP301' icon={BsGithub}/>
            <Footer.Icon href='#' icon={BsDribbble}/>

          </div>
        </div>
      </div>
    </Footer>
  );
}
