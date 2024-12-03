import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
import { FaLeaf } from "react-icons/fa";

export default function FooterCom() {
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-zTkbzeRhJeJWf3R0+cG/J/g196o0x6gQm7J4iO910kX5/Lqsn6/l6R7/p7/x7W94m/o4a1b9b0k/7d/w06x/e+0y10h890v12164d70V1/33/v/U10wOq+Z4p83/4e4V0s1G/P4u7a1T36i/c+b/7V89N2x6+i1+p/2/L16v/h+f/w" crossorigin="anonymous" referrerpolicy="no-referrer" />
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
              <Footer.Title title='Giới thiệu' />
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
              <Footer.Title title='Theo dõi' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://github.com/viet-tinh1/SEP490_FALL24_OPMS'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link href='#'>Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Ngôn ngữ' />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="flex items-center space-x-2">
                  <div class="flex -mb-5">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                    alt="Vietnam Flag"
                    className="w-5 h-5"
                  />
                  <span class="ml-2">Tiếng Việt</span>
                  </div>
                  
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="Project OPMS"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='#' icon={BsFacebook} />
            <Footer.Icon href='#' icon={BsInstagram} />
            <Footer.Icon href='#' icon={BsTwitter} />
            <Footer.Icon href='https://github.com/viet-tinh1/SEP490_FALL24_OPMS' icon={BsGithub} />
            <Footer.Icon href='#' icon={BsDribbble} />

          </div>
        </div>
      </div>
    </Footer>
  );
}
