<?php

namespace App\DataFixtures;

use App\Entity\MessageSettings;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    public const USER_1 = 'max@gmail.com';

    public const USER_2 = 'max2@gmail.com';

    public const USER_3 = 'max3@gmail.com';

    protected const USERS = [
        self::USER_1 => [
            'email' => self::USER_1,
            'fName' => 'Max',
            'lName' => 'Doe',
            'password' => 'password',
        ],
        self::USER_2 => [
            'email' => self::USER_2,
            'fName' => 'Max',
            'lName' => 'Doe',
            'password' => 'password',
        ],
        self::USER_3 => [
            'email' => self::USER_3,
            'fName' => 'Max',
            'lName' => 'Doe',
            'password' => 'password',
        ],

    ];

    /**
     * @var UserPasswordEncoderInterface
     */
    private UserPasswordEncoderInterface $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * @param ObjectManager $manager
     *
     * @throws \Exception
     */
    public function load(ObjectManager $manager): void
    {
        foreach (self::USERS as $data) {
            $user = (new User())->setEmail($data['email'])->setFirstName($data['fName'])->setLastName($data['lName']);
            $user->setPassword($this->encoder->encodePassword($user, $data['password']));
            $user->setMessageSettings(new MessageSettings());

            $manager->persist($user);
        }

        $manager->flush();
    }
}
