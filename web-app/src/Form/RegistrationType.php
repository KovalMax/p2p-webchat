<?php

namespace App\Form;

use App\DTO\Response\UserRegistration;
use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\IsTrue;

class RegistrationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('email', EmailType::class)
            ->add(
                'password',
                RepeatedType::class,
                [
                    'type' => PasswordType::class,
                    'first_options' => ['label' => 'Password'],
                    'second_options' => ['label' => 'Repeat password']
                ]
            )
            ->add('firstName', TextType::class)
            ->add('lastName', TextType::class)
            ->add(
                'termsAgreed',
                CheckboxType::class,
                [
                    'mapped' => false,
                    'constraints' => new IsTrue(),
                    'label' => 'I agree to the terms of service'
                ]
            )
            ->add('SignUp', SubmitType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            ['data_class' => UserRegistration::class, 'csrf_protection' => true, 'csrf_field_name' => '_token', 'csrf_token_id' => 'registration']
        );
    }
}