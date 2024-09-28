'use client';

import { Button } from '@/components/shadcn/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/shadcn/drawer';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Textarea } from '@/components/shadcn/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Message, useChat } from 'ai/react';
import { useInView } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  Bird,
  Book,
  Bot,
  BotMessageSquare,
  CircleStop,
  Code2,
  LifeBuoy,
  LucideIcon,
  Mic,
  MonitorCog,
  Paperclip,
  Settings,
  Settings2,
  Share,
  Sparkle,
  Sparkles,
  SquareTerminal,
  SquareUser,
  Turtle,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import { z } from 'zod';
import { ModeToggle } from './mode-toggle';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './shadcn/form';

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};

const sidebar: SidebarItem[] = [
  {
    label: 'Playground',
    icon: SquareTerminal,
  },
  {
    label: 'Models',
    icon: Bot,
    disabled: true,
  },
  {
    label: 'API',
    icon: Code2,
    disabled: true,
  },
  {
    label: 'Documentation',
    icon: Book,
    disabled: true,
  },
  {
    label: 'Settings',
    icon: Settings2,
    disabled: true,
  },
];

type Selectitem = {
  icon: LucideIcon;
  value: string;
  description: string;
  disabled?: boolean;
};

const models: Selectitem[] = [
  {
    icon: Sparkle,
    value: 'gemini-1.5-flash',
    description:
      "Google's fastest and most cost-effective model for high-volume, high-frequency tasks.",
    disabled: false,
  },
  {
    icon: Bird,
    value: 'explorer',
    description: 'Performance and speed for efficiency.',
    disabled: true,
  },
  {
    icon: Turtle,
    value: 'quantum',
    description: 'The most powerful model for complex computations.',
    disabled: true,
  },
];

const roles: Selectitem[] = [
  {
    icon: MonitorCog,
    value: 'system',
    description: "Initial instructions guiding the model's behavior and responses.",
  },
  {
    icon: User,
    value: 'user',
    description: 'Represents the end-user interacting with the AI model.',
    disabled: true,
  },
  {
    icon: BotMessageSquare,
    value: 'assistant',
    description: 'The AI model that assists the user based on input.',
    disabled: true,
  },
];

const formSchema = z.object({
  model: z.enum(['gemini-1.5-flash', 'explorer', 'quantum']),
  temperature: z.number(),
  topP: z.number(),
  topK: z.number(),
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1),
});

export default function Dashboard() {
  const bottomAnchorRef = useRef<HTMLDivElement>(null!);
  const isAnchorTargetInView = useInView(bottomAnchorRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: 'gemini-1.5-flash',
      temperature: 0.6,
      topK: 0.0,
      topP: 0.7,
      role: 'system',
      content: '',
    },
  });

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    body: form.getValues(),
    initialMessages: [
      {
        id: form.getValues().role,
        role: form.getValues().role,
        content: form.getValues().content,
      },
    ],
  });

  const scrollToBottom = () => {
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <TooltipProvider>
      <div className="relative flex h-screen w-full overflow-hidden">
        <aside className="z-20 flex h-full flex-col border-r">
          <div className="border-b p-2">
            <Button variant="outline" size="icon" aria-label="Home">
              <Link href="/">
                <BotMessageSquare className="size-5 fill-foreground" />
              </Link>
            </Button>
          </div>
          <nav className="grid gap-1 p-2">
            {sidebar.map((item) => (
              <Tooltip key={`sidebar-${item.label}`}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg bg-muted"
                    aria-label={item.label}
                    disabled={item.disabled}
                  >
                    <item.icon className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
          <nav className="mt-auto grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Help"
                  disabled
                >
                  <LifeBuoy className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Account"
                  disabled
                >
                  <SquareUser className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Account
              </TooltipContent>
            </Tooltip>
          </nav>
        </aside>
        <div className="relative h-full flex-1">
          <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
            <h1 className="text-xl font-semibold">Chatbot</h1>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Settings className="size-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <DrawerHeader>
                  <DrawerTitle>Configuration</DrawerTitle>
                  <DrawerDescription>
                    Configure the settings for the model and messages.
                  </DrawerDescription>
                </DrawerHeader>
                <Form {...form}>
                  <form className="grid w-full items-start gap-6">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                      <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel id="model">Model</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  id="model"
                                  className="items-start [&_[data-description]]:hidden"
                                >
                                  <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {models.map((model) => (
                                  <SelectItem
                                    key={model.value}
                                    value={model.value}
                                    disabled={model.disabled}
                                  >
                                    <div className="flex items-start gap-3 text-muted-foreground">
                                      <model.icon className="size-5" />
                                      <div className="grid gap-0.5">
                                        <p className="font-medium capitalize text-foreground">
                                          {model.value}
                                        </p>
                                        <p className="text-xs" data-description>
                                          {model.description}
                                        </p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="topP"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Top P</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="topK"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Top K</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </fieldset>
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                      <legend className="-ml-1 px-1 text-sm font-medium">Messages</legend>
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel id="role">Role</FormLabel>{' '}
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  id="role"
                                  className="items-start [&_[data-description]]:hidden"
                                >
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem
                                    key={role.value}
                                    value={role.value}
                                    disabled={role.disabled}
                                  >
                                    <div className="flex items-start gap-3 text-muted-foreground">
                                      <role.icon className="size-5" />
                                      <div className="grid gap-0.5">
                                        <p className="font-medium capitalize text-foreground">
                                          {role.value}
                                        </p>
                                        <p className="text-xs" data-description>
                                          {role.description}
                                        </p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="You are a..."
                                className="resize-none"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </fieldset>
                  </form>
                </Form>
              </DrawerContent>
            </Drawer>
            <div className="ml-auto flex items-center justify-center gap-2">
              <ModeToggle />
              <Button variant="outline" size="sm" className="gap-1.5 text-sm" disabled>
                <Share className="size-3.5" />
                Share
              </Button>
            </div>
          </header>
          <main className="relative flex h-[calc(100%-53px)] flex-row gap-4 p-4 pb-0">
            <div
              className="relative h-full overflow-y-auto scrollbar-none max-lg:hidden"
              x-chunk="A settings form a configuring an AI model and messages."
            >
              <Form {...form}>
                <form className="grid w-full items-start gap-6">
                  <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel id="model">Model</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                id="model"
                                className="items-start [&_[data-description]]:hidden"
                              >
                                <SelectValue placeholder="Select a model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {models.map((model) => (
                                <SelectItem
                                  key={model.value}
                                  value={model.value}
                                  disabled={model.disabled}
                                >
                                  <div className="flex items-start gap-3 text-muted-foreground">
                                    <model.icon className="size-5" />
                                    <div className="grid gap-0.5">
                                      <p className="font-medium capitalize text-foreground">
                                        {model.value}
                                      </p>
                                      <p className="text-xs" data-description>
                                        {model.description}
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="topP"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Top P</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="topK"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Top K</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </fieldset>
                  <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Messages</legend>
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel id="role">Role</FormLabel>{' '}
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                id="role"
                                className="items-start [&_[data-description]]:hidden"
                              >
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem
                                  key={role.value}
                                  value={role.value}
                                  disabled={role.disabled}
                                >
                                  <div className="flex items-start gap-3 text-muted-foreground">
                                    <role.icon className="size-5" />
                                    <div className="grid gap-0.5">
                                      <p className="font-medium capitalize text-foreground">
                                        {role.value}
                                      </p>
                                      <p className="text-xs" data-description>
                                        {role.description}
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="You are a..."
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </fieldset>
                </form>
              </Form>
            </div>
            <div className="relative flex size-full flex-1 flex-col rounded-xl bg-muted/50 p-4 pb-2">
              <div className="relative w-full flex-1 overflow-y-auto scrollbar-none">
                {messages && (
                  <div className="flex flex-col gap-7 pb-4 lg:mx-auto lg:w-11/12">
                    {messages.map((m) =>
                      m.role === 'user' ? (
                        <UserMessage key={m.id} {...m} />
                      ) : m.role === 'assistant' ? (
                        <AIMessage key={m.id} {...m} />
                      ) : undefined,
                    )}

                    <div ref={bottomAnchorRef} className="invisible" />
                  </div>
                )}
                {bottomAnchorRef.current && !isAnchorTargetInView && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="sticky bottom-4 left-1/2 flex -translate-x-1/2 animate-bounce rounded-full border-2 duration-1300 ease-in-out"
                    onClick={scrollToBottom}
                  >
                    <span className="sr-only">Scroll to end</span>
                    <ArrowDown />
                  </Button>
                )}
              </div>
              <form
                className="overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring lg:mx-auto lg:w-11/12"
                x-chunk="A form for sending a message to an AI chatbot. The form has a textarea and buttons to upload files and record audio."
                onSubmit={handleSubmit}
              >
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex items-center p-3 pt-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled>
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled>
                        <Mic className="size-4" />
                        <span className="sr-only">Use Microphone</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Use Microphone</TooltipContent>
                  </Tooltip>
                  <Button
                    type="submit"
                    size="icon"
                    className="ml-auto gap-1.5 rounded-full"
                    onClick={isLoading ? stop : undefined}
                  >
                    <span className="sr-only">Send Message</span>
                    {isLoading ? (
                      <CircleStop className="size-4" />
                    ) : (
                      <ArrowUp className="size-4" strokeWidth={3} />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

function UserMessage({ id, content }: Message) {
  return (
    <div
      key={id}
      className="relative flex max-w-[80%] items-start gap-3 self-end rounded-md bg-primary px-6 py-3 text-primary-foreground"
    >
      {content}
    </div>
  );
}

function AIMessage({ content }: Message) {
  return (
    <div className="relative flex items-start gap-3">
      <div className="relative flex items-center justify-center rounded-full">
        <Sparkles className="size-3.5" />
      </div>
      <div className="flex w-fit gap-x-4 rounded-md bg-muted px-6 py-3">
        <Markdown className="markdown">{content}</Markdown>
      </div>
    </div>
  );
}
