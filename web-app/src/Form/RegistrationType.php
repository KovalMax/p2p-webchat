<?php

namespace App\Form;

use App\DTO\Request\UserRegistration;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TimezoneType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\IsTrue;

final class RegistrationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('email', EmailType::class, ['attr' => ['class' => 'rounded-pill'], 'label' => 'email'])
            ->add(
                'password',
                RepeatedType::class,
                [
                    'type' => PasswordType::class,
                    'first_options' => ['label' => 'password', 'attr' => ['class' => 'rounded-pill']],
                    'second_options' => ['label' => 'repeatPassword', 'attr' => ['class' => 'rounded-pill']],
                ]
            )
            ->add('firstName', TextType::class, ['attr' => ['class' => 'rounded-pill'], 'label' => 'firstName'])
            ->add('lastName', TextType::class, ['attr' => ['class' => 'rounded-pill'], 'label' => 'lastName'])
            ->add('timezone', TimezoneType::class, ['attr' => ['class' => 'rounded-pill'], 'label' => 'timezone',])
            ->add(
                'termsAgreed',
                CheckboxType::class,
                [
                    'attr' => ['class' => 'rounded-pill'],
                    'mapped' => false,
                    'constraints' => new IsTrue(),
                    'label' => 'termsService',
                ]
            )
            ->add('SignUp', SubmitType::class, ['label' => 'signUp']);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            ['data_class' => UserRegistration::class, 'csrf_protection' => true, 'csrf_field_name' => '_token', 'csrf_token_id' => 'registration']
        );
    }
}