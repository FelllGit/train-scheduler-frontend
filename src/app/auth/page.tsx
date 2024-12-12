"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FormProvider, useForm } from "react-hook-form";
import { authenticate } from "@/services/auth";

interface AuthFormProps {
  email: string;
  password: string;
}

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<AuthFormProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    register,
    // eslint-disable-next-line no-restricted-syntax
    formState: { errors },
  } = methods;

  const onSubmit = (data: AuthFormProps) => {
    const { email, password } = data;

    const auth = async () => {
      try {
        const jwt = await authenticate(email, password);
        console.log(jwt);

        toast({
          title: "Authentication successful",
          description: "Enjoy :^)",
        });

        router.push("/");
      } catch (error) {
        toast({
          title: "Error while authenticating",
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    auth();
  };

  return (
    <FormProvider {...methods}>
      <Card className="w-96">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-xs pl-2 text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Password"
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="text-xs pl-2 text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Login</Button>
            <Button
              variant="link"
              onClick={() => router.push("/auth/registration")}
            >
              Register
            </Button>
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  );
}
