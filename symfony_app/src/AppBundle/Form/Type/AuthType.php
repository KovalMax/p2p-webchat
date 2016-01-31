<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 29.01.2016
 * Time: 23:32
 */
namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class AuthType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('userName',TextType::class, [
            'label' => 'Username',
            'attr' => ['class' => 'form-control']
        ])
            ->add('password', PasswordType::class, [
                'attr' => ['class' => 'form-control']
            ])
            ->add('login', SubmitType::class, [
                'label' => 'Log In',
                'attr' => ['class' => 'btn btn-primary btn-block']
            ])
        ;
    }

   /* public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Auth'
        ));
    }*/
}