import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import React from 'react';
import { Link } from 'react-router-dom';
import companies from '../components/Data/companies.json';
import Autoplay from 'embla-carousel-autoplay';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import faqs from '../components/Data/faq.json';

function Landing() {
  return (
    <main className="flex flex-col gap-14 sm:gap-24 py-10 sm:py-20">
      {/* Hero Section */}
      <section className="text-center px-4">
        <h1 className="flex flex-col items-center justify-center text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight py-4">
          Find Your Dream Jobs
          <span className="flex items-center gap-3 sm:gap-6 mt-2">
            and get{' '}
            <img
              src="/logo.png"
              alt="Hirdd logo"
              className="h-12 sm:h-20 lg:h-28 object-contain"
            />
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 mt-4 text-sm sm:text-lg">
          Explore thousands of job listings or find the perfect candidate.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link to="/jobs">
            <Button variant="blue" size="xl" className="px-8 py-4 text-lg">
              Find Jobs
            </Button>
          </Link>
          <Link to="/post-job">
            <Button variant="destructive" size="xl" className="px-8 py-4 text-lg">
              Post a Job
            </Button>
          </Link>
        </div>
      </section>

      {/* Company Carousel */}
      <section className="py-10 px-4 max-w-7xl mx-auto w-full">
        <Carousel plugins={[Autoplay({ delay: 2500 })]} className="w-full">
          <CarouselContent className="flex gap-6 sm:gap-12 items-center">
            {companies.map(({ name1, id, path }) => (
              <CarouselItem
                key={id}
                className="flex justify-center basis-1/2 sm:basis-1/4 lg:basis-1/6"
              >
                <img
                  src={path}
                  alt={name1}
                  className="h-10 sm:h-16 object-contain opacity-80 hover:opacity-100 transition duration-300"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Banner */}
      
       <img
  src="/banner.jpg"
  alt="Banner"
  className="
    block mx-auto
    w-full max-w-7xl
    h-48 sm:h-64 md:h-80 lg:h-[28rem] xl:h-[32rem]
    object-cover
    rounded-lg shadow-lg
  "
/>

      

      {/* Cards */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <Card className="hover:shadow-lg transition rounded-xl border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Search and apply for jobs, track your applications, and find your dream role effortlessly.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition rounded-xl border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Post job openings, manage applicants, and hire the perfect talent for your company.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 text-left text-lg font-medium  transition">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}

export default Landing;
