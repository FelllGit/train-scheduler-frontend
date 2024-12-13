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
import { redirect } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { registerUser } from "@/services/register";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default function AuthPage() {
  const { toast } = useToast();
  const methods = useForm<RegisterFormProps>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const {
    handleSubmit,
    register,
    // eslint-disable-next-line no-restricted-syntax
    formState: { errors },
    watch,
  } = methods;

  const onSubmit = (data: RegisterFormProps) => {
    const { firstName, lastName, email, password } = data;
    try {
      registerUser(firstName, lastName, email, password);
    } catch (error) {
      toast({
        title: "Error while registering user",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      toast({
        title: "Registration successful",
        description: "User registered successfully",
      });
      redirect("/auth");
    }
  };

  return (
    <FormProvider {...methods}>
      <Card className="w-96">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Registration</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="First name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <span className="text-xs pl-2 text-red-500">
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <span className="text-xs pl-2 text-red-500">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>
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
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <span className="text-xs pl-2 text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                type="password"
                placeholder="Repeat password"
                {...register("repeatPassword", {
                  required: "Repeat password is required",
                  validate: (value) =>
                    // eslint-disable-next-line no-restricted-syntax
                    value === watch("password") || "Passwords do not match",
                })}
              />
              {errors.repeatPassword && (
                <span className="text-xs pl-2 text-red-500">
                  {errors.repeatPassword.message}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Register</Button>
            <Button variant="link" onClick={() => redirect("/auth")}>
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  );
}
