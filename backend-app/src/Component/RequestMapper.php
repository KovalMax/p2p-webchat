<?php

namespace App\Component;

use App\Exception\ConstraintValidationException;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class RequestMapper
{
    /**
     * @var SerializerInterface
     */
    private SerializerInterface $serializer;

    /**
     * @var ValidatorInterface
     */
    private ValidatorInterface $validator;

    /**
     * @param SerializerInterface $serializer
     * @param ValidatorInterface  $validator
     */
    public function __construct(SerializerInterface $serializer, ValidatorInterface $validator)
    {
        $this->serializer = $serializer;
        $this->validator = $validator;
    }

    /**
     * @param string $classname
     * @param string $jsonData
     *
     * @return object
     * @throws ConstraintValidationException
     */
    public function toDto(string $classname, string $jsonData): object
    {
        $dto = $this->serializer->deserialize($jsonData, $classname, JsonEncoder::FORMAT);
        $errors = $this->validator->validate($dto);
        if ($errors->count() > 0) {
            throw ConstraintValidationException::createFromViolationList($errors);
        }

        return $dto;
    }
}
