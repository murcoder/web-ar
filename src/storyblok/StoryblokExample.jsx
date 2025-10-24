import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx';
import { X } from 'lucide-react';
import { StoryblokRichText } from '@storyblok/react';

/**
 * Example UI Element with fallback content when story is null
 * @returns {JSX.Element}
 * @constructor
 */
export const StoryblokExample = ({ story, onClose }) => {
  // Provide example fallback data when story or its content is missing
  const exampleStory = {
    content: {
      headline: 'Example Headline',
      sub_headline: 'This is a sample subheadline for demonstration.',
      image: {
        filename: '/img/example_image.jpg',
        alt: 'Example placeholder image'
      },
      description: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'This is an example description shown when no Storyblok content is available. Replace it with your real content.'
              }
            ]
          }
        ]
      }
    }
  };

  // Use the provided story or fallback example
  const activeStory = story?.content ? story : exampleStory;

  return (
    <div className="fixed inset-0 top-16 flex items-start justify-center z-30 overflow-auto bg-black/40">
      <Card className="w-full h-[calc(100vh-4rem)] p-2 md:p-10 bg-white/90 rounded-none shadow-lg select-none text-center">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-lg font-bold hover:bg-gray-800 transition"
          aria-label="Close info card"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle className="bg-education-900 text-white rounded-4xl py-6">
            <h1 className="font-display text-6xl font-bold">
              {activeStory.content.headline}
            </h1>
            {activeStory.content.sub_headline && (
              <h2 className="pt-4 text-2xl font-bold">
                {activeStory.content.sub_headline}
              </h2>
            )}
          </CardTitle>

          <div className="flex justify-center py-8">
            <img
              src={activeStory.content.image.filename}
              alt={activeStory.content.image.alt}
              className="w-full max-w-sm h-auto object-cover pointer-events-auto rounded-lg shadow-md"
            />
          </div>
        </CardHeader>

        <CardContent className="overflow-auto">
          <CardDescription className="mb-4">
            <div className="prose text-left mx-auto">
              <StoryblokRichText doc={activeStory.content.description} />
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};
